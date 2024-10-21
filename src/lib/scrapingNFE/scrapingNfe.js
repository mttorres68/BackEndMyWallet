import { Builder, Browser, By } from "selenium-webdriver"
import firefox from "selenium-webdriver/firefox.js"
import { parse } from "node-html-parser"

const nfce1 =
  "22240903995515019003650170000822321002347323%7C2%7C1%7C1%7C33cc03a23f5bbec172b3bfec79aefc05be96510d"

const nfce2 =
  "22240935138346000216650180001789661129620429%7C2%7C1%7C1%7C4CE6CE228495AAD15D024557B632F7A9B5A3EEB9"

const nfce =
  "22240703995515019003650300002381901003050547%7C2%7C1%7C1%7C4450158caefbdff8e770a42378463d1d862c6d89"
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchDataNfce(codeNfce) {
  const url = "https://www.sefaz.pi.gov.br/nfce?p="

  const nfceData = {
    enterprise: "",
    cnpj: "",
    address: "",
    products: [],
    total_items: "",
    total_value: "",
    payment_method: "",
    purchase_date: ""
  }

  let driver = await new Builder()
    .setFirefoxOptions(
      new firefox.Options().addArguments(
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-setuid-sandbox",
        "--disable-extensions",
        "--disable-infobars",
        "--disable-popup-blocking",
        "--disable-notifications",
        "--disable-offer-store-unmasked-wallet-cards",
        "--disable-offer-upload-credit-cards",
        "--disable-features=site-per-process",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu-rasterization",
        "--disable-databases"
      )
    )
    .forBrowser(Browser.FIREFOX)
    .build()

  try {
    await driver.get(`${url}${codeNfce}`)

    // AGUARDA 3 SEGUNDOS PARA GARANTIR QUE A PÁGINA CARREGUE
    // await sleep(3000);
    await driver.manage().setTimeouts({ implicit: 2000 })

    // COLETA AS INFORMAÇÕES PRINCIPAIS DA EMPRESA
    const companyData = await driver.findElements(
      By.className("NFCCabecalho_SubTitulo1")
    )

    const textEnterprise = await Promise.all(
      companyData.map((item) => item.getText())
    )

    const fullTextEnterprise = textEnterprise.join("\n")

    const lines = fullTextEnterprise
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "")

    // DADOS DA EMPRESA
    nfceData.enterprise = lines[0] || ""
    nfceData.cnpj = lines[1]
    nfceData.address = lines[3]

    // DADOS DA COMPRA
    const getPurchases = await driver.findElements(
      By.className("borda-pontilhada-botton")
    )

    // O PADRÃO É TRAZER TRÊS TABELAS, DO CUPOM DA NFC-e
    const textPurchases = await Promise.all(
      getPurchases.map((item) => item.getAttribute("outerHTML"))
    )

    // EXTRAI INFORMAÇÕES DOS PRODUTOS - GERANDO UMA LISTA DO PRODUTOS EM HTML - IGNORANDO A PRIMEIRA TABELA
    const outerHTMLShoppingList = textPurchases[1].slice(1)

    // GERAR UM PARSE DO HTML
    const parseHtml = parse(outerHTMLShoppingList)

    // O HTML ESTANDO EM PARSE - SELECIONE TODAS AS 'tr' E TRANSFORME EM ARRAY
    const selectTr = Array.from(parseHtml.querySelectorAll("tr"))

    function extractTableData(parseHtml) {
      let arrayPurchases = []
      // SELECIONAR TODAS AS 'td' DENTRO DE CADA 'tr'
      parseHtml.forEach((row) => {
        const columns = Array.from(row.querySelectorAll("td"))

        if (columns.length > 0) {
          // PEGAR SOMENTE O CONTEÚDO DENTRO DE CADA 'td' E REMOVER OS ESPAÇOS VAZIOS E ADD DENTRO DA ARRAY
          arrayPurchases.push(columns.map((col) => col.textContent.trim()))
        }
      })

      // RETORNA UMA Array de Array
      return arrayPurchases
    }

    // PASSO TODAS AS 'tr' E PULO O PRIMEIRO Array - POIS É CABEÇALHO
    const arrayPurchases = extractTableData(selectTr).slice(1)

    arrayPurchases.forEach((item) => {
      if (item.length === 6) {
        nfceData.products.push({
          code: item[0],
          description: item[1],
          amount: item[2],
          unit: item[3],
          uni_value: item[4],
          total_value: item[5]
        })
      }
    })

    const outerHTMLPurchaseData = textPurchases[2]
    const ParsePurchaseData = parse(outerHTMLPurchaseData)
    const selectTrPurchaseData = Array.from(
      ParsePurchaseData.querySelectorAll("tr")
    )
    const arrayPurchaseData = extractTableData(selectTrPurchaseData)

    nfceData.total_items = arrayPurchaseData[0][1]
    nfceData.total_value = arrayPurchaseData[1][1]
    nfceData.payment_method = arrayPurchaseData[3][0]

    // DATA DE EMISSÃO
    const getPurchaseDate = await driver
      .findElement(By.xpath("//td[contains(text(),'Data de Emissão')]"))
      .then((item) => item.getText())

    const getDateRegex = getPurchaseDate.match(
      /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
    )

    nfceData.purchase_date = getDateRegex[0]

    return nfceData
  } catch (e) {
    console.log("ERRO:", e)
  } finally {
    await driver.quit()
  }
}

export { fetchDataNfce }
