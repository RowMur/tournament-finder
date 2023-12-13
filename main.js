const { JSDOM } = require("jsdom")

const fetchPage = async () => {
    const page = await fetch("https://www.tabletennisengland.co.uk/events")
    const html = await page.text()

    const dom = new JSDOM(html)
    const aTags = dom.window.document.querySelectorAll("a")
    aTags.forEach((aTag) => {
        console.log(aTag.href)
    })
}

fetchPage()