export type TSidebarKey =
  | 'inventory'
  | 'woodcutting'
  | 'mining'
  | 'fishing'
  | 'alchemy'
  | 'smelting'
  | 'cooking'
  | 'forge'
  | 'market'
  | 'vendor'
  | 'battle'
  | 'pets'
  | 'guilds'

export interface ICharacter {
  name: string
  duration: {
    maxSkill: number
    boss?: number
  }
}
