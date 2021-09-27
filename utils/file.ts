import * as sharp from 'sharp'
import * as fs from 'fs'
import sizeOf from 'image-size'
import { SIZE, STATIC_URL } from '@/constants/file'

const fileUpload = async (file_topic, reference_code, files, sub_topic?: any) => {
  try {
    const file_dir = !sub_topic
        ? `public/${file_topic}/${reference_code}`
        : `public/${file_topic}/${reference_code}/${sub_topic}`,
      result = []
    if (!fs.existsSync(file_dir)) fs.mkdirSync(file_dir, { recursive: true })
    await Promise.all(
      Object.keys(files).map(async (item) => {
        await Promise.all(
          files[item].map(async (file) => {
            const { fieldname, originalname, mimetype, buffer, size } = file,
              dir_type = mimetype.includes('image') ? 'images' : 'docs',
              file_dir_type = `${file_dir}/${dir_type}`
            if (!fs.existsSync(file_dir_type)) await fs.mkdirSync(file_dir_type)
            const fileEx = originalname.split('.').slice(-1).pop()
            const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
            let path = ''
            if (dir_type === 'images') {
              /** CHECK IMAGE PROPERTY */
              const { height, width } = sizeOf(buffer)
              /** GET IMAGE STYLE */
              const IMAGE_SIZE_STYLE = height > width ? SIZE.VERTICAL : width > height ? SIZE.HORIZONTAL : SIZE.SQUARE
              await Promise.all(
                await Object.keys(IMAGE_SIZE_STYLE).map(async (size_item) => {
                  const dir = `${file_dir_type}/${fieldname}/${size_item.toString()}`
                  if (!fs.existsSync(dir)) await fs.mkdirSync(dir, { recursive: true })
                  path = `${dir}/${name}.${fileEx}`
                  result.push({
                    reference_code,
                    fileType: size_item.toString(),
                    fieldname,
                    mimetype,
                    name: `${name}.${fileEx}`,
                    size,
                    path: path.replace('public', STATIC_URL)
                  })
                  /** fill is resize image without crop */
                  await sharp(buffer)
                    .resize({ width: IMAGE_SIZE_STYLE[size_item].width, fit: 'cover' })
                    .withMetadata()
                    .toFile(path)
                })
              )
            }
            if (dir_type === 'docs') {
              const dir = `${file_dir_type}/${fieldname}`
              path = `${dir}/${name}.${fileEx}`
              if (!fs.existsSync(dir)) await fs.mkdirSync(dir)
              await fs.writeFileSync(path, buffer)
              result.push({
                reference_code,
                fileType: 'PDF',
                fieldname,
                mimetype,
                name: `${name}.${fileEx}`,
                size,
                path: path.replace('public', STATIC_URL)
              })
            }
          })
        )
      })
    )
    return result
  } catch (error) {
    console.log(error.message)
    return false
  }
}

const handleFileFields = async (files) => {
  try {
    const file = { files: [] }
    await files.map((item) => {
      const {
        fieldname: fileField,
        fileType,
        mimetype: fileExtension,
        name: fileName,
        size: fileSize,
        path: filePath
      } = item
      file.files.push({ fileField, fileType, fileExtension, fileName, fileSize, filePath })
    })
    return file
  } catch (error) {
    console.log(error.message)
    return false
  }
}

export { fileUpload, handleFileFields }
