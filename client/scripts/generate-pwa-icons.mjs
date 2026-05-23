import sharp from "sharp"

await sharp("./public/pwa/logo.jpeg")
  .resize(192, 192)
  .png()
  .toFile("./public/pwa/icon-192.png")

await sharp("./public/pwa/logo.jpeg")
  .resize(512, 512)
  .png()
  .toFile("./public/pwa/icon-512.png")

console.log("New restaurant PWA icons generated successfully")
