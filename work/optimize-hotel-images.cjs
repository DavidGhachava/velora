const fs = require('node:fs/promises')
const path = require('node:path')
const sharp = require('sharp')

const hotelImages = [
  ['rooms-batumi', 'https://cache.marriott.com/is/image/marriotts7prod/ds-busrh-hotel-exterior-14385:Wide-Hor?wid=1800&fit=constrain'],
  ['le-meridien-batumi', 'https://api.visitbatumi.com/media/images/1280x720/3afca11dd3d64dad91445e11431f5188.webp'],
  ['hilton-batumi', 'https://www.hotelscombined.com/himg/ed/b8/79/ice-2151270-110113565-186463.jpg'],
  ['radisson-blu-batumi', 'https://gobatumi.com/files/accommodation/batumi/radisson-blu/radisson-blu-1.jpg'],
  ['wyndham-batumi', 'https://www.wyndhamhotels.com/content/dam/property-images/en-us/hr/ge/others/batumi/50527/50527_Hotel_view_2.jpg?crop=2994:1996;*,*&downsize=1800:*'],
  ['courtyard-batumi', 'https://cache.marriott.com/content/dam/marriott-digital/cy/emea/hws/b/buscy/en_us/photo/unlimited/assets/cy-buscy-hotel-exterior-20758-37475.jpg'],
  ['ibis-styles-batumi', 'https://intranet.infoajara.com/storage/images/GWnWdgrh2eOVoHQAScLnk9WZ418jjswSxdB5tilP.jpg'],
]

const veloraImages = [
  ['garden', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85'],
  ['sea', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85'],
  ['suite', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85'],
  ['residence', 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1800&q=85'],
  ['pool', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1800&q=85'],
  ['coast', 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1800&q=85'],
  ['dining', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=85'],
]

async function main() {
  const outputDirectory = path.resolve('public/images/hotels')
  await fs.mkdir(outputDirectory, { recursive: true })

  for (const [slug, url] of hotelImages) {
    const response = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 Velora media optimizer' } })
    if (!response.ok) throw new Error(`${slug}: ${response.status} ${response.statusText}`)
    const source = Buffer.from(await response.arrayBuffer())
    for (const width of [640, 1280]) {
      await sharp(source)
        .rotate()
        .resize(width, Math.round(width / 1.6), { fit: 'cover', position: 'attention' })
        .webp({ quality: width === 640 ? 74 : 80, effort: 5 })
        .toFile(path.join(outputDirectory, `${slug}-${width}.webp`))
    }
  }

  const veloraDirectory = path.resolve('public/images/velora')
  await fs.mkdir(veloraDirectory, { recursive: true })
  for (const [name, url] of veloraImages) {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`${name}: ${response.status} ${response.statusText}`)
    const source = Buffer.from(await response.arrayBuffer())
    for (const width of [640, 1600]) {
      await sharp(source)
        .rotate()
        .resize(width, Math.round(width / 1.6), { fit: 'cover', position: 'attention' })
        .webp({ quality: width === 640 ? 72 : 79, effort: 5 })
        .toFile(path.join(veloraDirectory, `${name}-${width}.webp`))
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
