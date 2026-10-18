// VARIAVEIS DO HTML
const pLocalizacao = document.querySelector('.localizacao')
const h2GralCeusios = document.querySelector('.gral_celsius')
const pClima = document.querySelector('.clima')
const spanMaxTemp = document.querySelector('.max_temp')
const spanMinTemp = document.querySelector('.min_temp')
const pUmidade = document.querySelector('.umidade_porcentagem')
const h3Vento = document.querySelector('.vento_km')
const spanKm = document.querySelector('.spanKm')
const indiceUv = document.querySelector('.indice_uv')
const imgIcon = document.querySelector('.img_icon')

const APITemp = async (cidade) => {

    try {
        const URL = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=32bf5d22d25e493897e84202262905&q=${encodeURIComponent(cidade)}&days=1&lang=pt`)


        if (!URL.ok) {
            throw new Error(`Erro ${URL.status}`)
        }

        const data = await URL.json()

        pLocalizacao.textContent = data.location.name + ', BR'
        h2GralCeusios.textContent = `${Math.floor(data.current.temp_c)}°C`
        pClima.textContent = data.current.condition.text
        spanMaxTemp.textContent = `${Math.floor(data.forecast.forecastday[0].day.maxtemp_c)}°`
        spanMinTemp.textContent = `${Math.floor(data.forecast.forecastday[0].day.mintemp_c)}°`
        pUmidade.textContent = `${data.current.humidity} %`
        h3Vento.innerHTML = `${data.current.wind_kph} <span>km/h</span>`
        indiceUv.innerHTML = `${data.current.uv} <span>médio</span>`

        return data
    } catch (erro) {
        console.log(`Erro na requisição: ${erro}`)
        pLocalizacao.textContent = 'Cidade não encontrada'
        pClima.textContent = 'Tente buscar novamente'
        return null
    }
}


const input = document.getElementById("text")
const formularioPesquisa = document.querySelector('.pesquisar')
const painelClima = document.querySelector('.geral_grid')
const botaoPesquisa = formularioPesquisa.querySelector('button')

input.addEventListener('input', () => {
    const valorAtual = input.value
    const inicioSelecao = input.selectionStart
    const fimSelecao = input.selectionEnd
    const valorFormatado = valorAtual.replace(
        /(^|\s)([A-Za-zÀ-ÖØ-öø-ÿ])/g,
        (_, espaco, letra) => espaco + letra.toLocaleUpperCase('pt-BR')
    )

    if (valorAtual === valorFormatado) return

    input.value = valorFormatado

    input.setSelectionRange(inicioSelecao, fimSelecao)
})

formularioPesquisa.addEventListener('submit', async (event) => {
    event.preventDefault()
    const inputValue = input.value.trim()

    if (!inputValue) {
        input.focus()
        return
    }

    painelClima.classList.remove('dados-visiveis')
    painelClima.classList.add('carregando')
    formularioPesquisa.classList.add('is-loading')
    formularioPesquisa.setAttribute('aria-busy', 'true')
    input.disabled = true
    botaoPesquisa.disabled = true

    progresso.classList.remove('animar')
    progresso.style.transition = 'none'
    progresso.style.width = '0%'
    void progresso.offsetWidth
    progresso.style.removeProperty('transition')

    const [dados] = await Promise.all([
        iconTempo(inputValue),
        new Promise((resolve) => setTimeout(resolve, 220))
    ])

    painelClima.classList.remove('carregando')
    void painelClima.offsetWidth
    painelClima.classList.add('dados-visiveis')
    formularioPesquisa.classList.remove('is-loading')
    formularioPesquisa.removeAttribute('aria-busy')
    input.disabled = false
    botaoPesquisa.disabled = false

    if (dados) {
        divBarra(dados.current.humidity)
        input.value = ''
    }

    input.focus()
})

// BARRA DE PROGRESSO 
const barra = document.querySelector(".barra")
const progresso = document.querySelector(".progresso")

const divBarra = (pro) => {
    requestAnimationFrame(() => {
        progresso.style.width = Math.min(Math.max(pro, 0), 100) + '%'
        progresso.classList.add('animar')
    })

    return pro
}

// ICONES TEMPO

const weatherIcons = {
    // Sol
    1000: "img/sol.png",

    // Nublado
    1003: "img/nublado.png",
    1006: "img/nublado.png",
    1009: "img/nublado.png",
    1030: "img/nublado.png",
    1135: "img/nublado.png",
    1147: "img/nublado.png",

    // Chuva
    1063: "img/chuva.png",
    1150: "img/chuva.png",
    1153: "img/chuva.png",
    1180: "img/chuva.png",
    1183: "img/chuva.png",
    1186: "img/chuva.png",
    1189: "img/chuva.png",
    1192: "img/chuva.png",
    1195: "img/chuva.png",
    1240: "img/chuva.png",
    1243: "img/chuva.png",
    1246: "img/chuva.png",

    // Trovoada
    1087: "img/trovoada.png",
    1273: "img/trovoada.png",
    1276: "img/trovoada.png",
    1279: "img/trovoada.png",
    1282: "img/trovoada.png",

    // Neve/Granizo
    1066: "img/neve.png",
    1069: "img/neve.png",
    1072: "img/neve.png",
    1114: "img/neve.png",
    1117: "img/neve.png",
    1204: "img/neve.png",
    1207: "img/neve.png",
    1210: "img/neve.png",
    1213: "img/neve.png",
    1216: "img/neve.png",
    1219: "img/neve.png",
    1222: "img/neve.png",
    1225: "img/neve.png",
    1237: "img/neve.png",
    1249: "img/neve.png",
    1252: "img/neve.png",
    1255: "img/neve.png",
    1258: "img/neve.png",
    1261: "img/neve.png",
    1264: "img/neve.png"
}

const img = document.querySelector(".img_icon")

const iconTempo = async (icon) => {
    const dataAPI = await APITemp(icon)

    if (!dataAPI) return false

    const iconCode = dataAPI.current.condition.code
    img.src = weatherIcons[iconCode] || "img/sol.png"
    img.alt = dataAPI.current.condition.text
    return dataAPI
}







