import { NOUNS } from '@data/nouns'

export default function generateRandomLabel(): { label: string; data: string } {
  const randomAdjective = NOUNS[Math.floor(Math.random() * NOUNS.length)]

  return {
    label: randomAdjective,
    data: `${randomAdjective} Folder`,
  }
}
