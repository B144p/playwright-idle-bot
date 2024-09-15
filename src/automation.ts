import { Browser, chromium, Page } from 'playwright'
import { ICharacter, TSidebarKey } from './interfaces'

const loginUrl = 'https://web.idle-mmo.com/login'
const username = process.env.USERNAME || ''
const password = process.env.PASSWORD || ''

const characters: ICharacter[] = [
  { name: 'bTset', duration: { maxSkill: 100 * 60 * 1000 } },
  { name: 'bTsetRo', duration: { maxSkill: 80 * 60 * 1000 } },
]

if (!username || !password) {
  throw new Error('Username or password not provided in .env file.')
}

async function automate() {
  const browser: Browser = await chromium.launch({ headless: false })
  const page: Page = await browser.newPage()

  try {
    await onLoginPage(page)

    // Mode: Skill farm
    await onSkillActivate(page, 'woodcutting', 80 * 60 * 1000)

    // Mode: Battle farm

    // Mode: Dungeons farm

    // await performTask(page);
  } catch (error) {
    console.error('An error occurred:', error)
  } finally {
    await browser.close()
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function onLoginPage(page: Page) {
  await page.goto(loginUrl)
  await page.locator('#email').fill(username)
  await page.locator('#password').fill(password)
  await page.click('button[type="submit"]')
  await sleep(1000)
}

async function onClickOnSidebar(page: Page, tab: TSidebarKey) {
  // const sidbarSelector = 'div.lg:fixed.lg:inset-y-0.lg:z-20.lg:flex.lg:w-72.lg:flex-col'
  // await page.locator(`${sidbarSelector} div:has-text("${tab}")`).first().click()

  await page.goto(
    (() => {
      switch (tab) {
        case 'woodcutting':
        case 'mining':
        case 'fishing':
        case 'alchemy':
        case 'smelting':
        case 'cooking':
        case 'forge':
          return `https://web.idle-mmo.com/skills/view/${tab}`
        case 'inventory':
        case 'battle':
        case 'pets':
        case 'guilds':
          return `https://web.idle-mmo.com/${tab}`
        case 'market':
          return 'https://web.idle-mmo.com/market/listings'
        case 'vendor':
          return 'https://web.idle-mmo.com/vendor/shop'
        default:
          return '#'
      }
    })(),
  )
  await sleep(1000)
}

async function onSkillActivate(page: Page, skill: TSidebarKey, time: number) {
  const optionSelector = '//*[@id="game-container"]/div[1]/div[1]/div[2]/div[2]/ul/button[2]/li'
  const dialogSubmitSelector = '//*[@id="game-container"]/div[2]/div[1]/div/div[2]/div/div[3]/form/div/button'

  for (const [i, data] of characters.entries()) {
    await page.keyboard.press(`Alt+${i + 1}`)
    await sleep(5000)
    await onClickOnSidebar(page, 'woodcutting')
    await page.locator(optionSelector).click()
    await sleep(1000)
    await page.locator(dialogSubmitSelector).click()
  }

  // Waiting for next loop with (time + 2.5 min) that +- 2.5 min
  await sleep(time + Math.random() * (5 * 60 * 1000))
  await onSkillActivate(page, skill, time)
}

// Start the automation
automate()
