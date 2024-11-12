class jogoDaVelha {
    constructor(jogador1 = new jogadorHumano("❌"), jogador2 = new jogadorHumano("⭕️"), tamanho = 3) {
        this.jogador1 = jogador1
        this.jogador2 = jogador2
        this.tamanho = tamanho
        this.zerar()
    }

    jogar(jogada) {
        if (this.jogadorAtual.humano) {
            this.#processarJogada(jogada)
        }

        while (!this.vencedor && !this.jogadorAtual.humano) {
            let computador = this.jogadorAtual.jogar(this.tabuleiro)
            this.#processarJogada(computador)
        }
    }

    zerar() {
        this.jogadorAtual = this.jogador1
        this.tabuleiro = this.#iniciarTabuleiro()
        this.vencedor = null
    }

    #iniciarTabuleiro() {
        return Array(this.tamanho).fill(0).map(posicao => Array(this.tamanho).fill(null))
    }

    #processarJogada(jogada) {
        if (!this.#jogadaValida(jogada)) return;

        this.#adicionarJogada(jogada);
        if (this.#conquistouVitoriaComJogada(jogada)) {
            this.vencedor = this.jogadorAtual.simbolo;
            return;
        } else if (this.#finalizouComEmpate()) {
            this.vencedor = "-";
            return;
        }
        this.#trocarJogador();
    }

    #trocarJogador() {
        this.jogadorAtual = this.jogadorAtual.simbolo === this.jogador1.simbolo ? this.jogador2 : this.jogador1
    }

    #adicionarJogada(jogada) {
        let { linha, coluna } = jogada
        this.tabuleiro[linha - 1][coluna - 1] = this.jogadorAtual.simbolo
    }

    #jogadaValida(jogada) {
        if (jogada.invalida) return false

        let { linha, coluna } = jogada
        if (linha > this.tamanho || coluna > this.tamanho) return false

        if (this.#ocupado(jogada)) {
            return false
        }

        if (this.vencedor) {
            return false
        }

        return true
    }

    #ocupado(jogada) {
        let { linha, coluna } = jogada
        return this.#campo(linha, coluna) !== null
    }

    #campo(linha, coluna) {
        return this.tabuleiro[linha - 1][coluna - 1]
    }

    #finalizouComEmpate() {
        let espacosVazios = this.tabuleiro.flat().filter(campo => campo === null)
        return espacosVazios.length === 0

    }

    #conquistouVitoriaComJogada(jogada) {
        let { linha, coluna } = jogada;
        let { tabuleiro, jogadorAtual } = this;
        let tamanho = tabuleiro.length;
        let indices = Array(tamanho).fill(0).map((_, indice) => indice + 1);
        let ganhouEmLinha = indices.every((i) => this.#campo(linha, i) === jogadorAtual.simbolo)
        let ganhouEmColuna = indices.every((i) => this.#campo(i, coluna) === jogadorAtual.simbolo)
        let ganhouEmDiag1 = indices.every((i) => this.#campo(i, i) === jogadorAtual.simbolo)
        let ganhouEmDiag2 = indices.every((i) => this.#campo(tamanho - i + 1, i) === jogadorAtual.simbolo)

        return ganhouEmLinha || ganhouEmColuna || ganhouEmDiag1 || ganhouEmDiag2;
    }

    toString() {
        let matriz = this.tabuleiro.map((linha) => linha.map((posicao) => posicao ?? "-").join(" ")).join("\n")
        let quemVenceu = this.vencedor ? ` Vencedor: ${this.vencedor}` : "";
        return `${matriz} \n ${quemVenceu}`;
    }

    status() {
        if (this.vencedor === "-") {
            return "Ops! 🤪 Jogo Empatado!"

        } else if (this.vencedor) {

            return `Parabens! ${this.vencedor} Venceu 👏😁🏆`

        } else {
            return `É a vez do ${this.jogadorAtual.simbolo} Jogar 🫣`
        }
    }

}


class jogadorHumano {
    constructor(simbolo) {
        this.simbolo = simbolo
        this.humano = true
    }
}


class jogadorAleatorio {
    constructor(simbolo) {
        this.simbolo = simbolo
        this.humano = false
    }

    jogar(tabuleiro) {
        let linha = this.#aleatorio(1, tabuleiro.length)
        let coluna = this.#aleatorio(1, tabuleiro.length)

        return new jogada(linha, coluna)
    }

    #aleatorio(min, max) {
        let valor = Math.random() * (max - min) + min
        return Math.round(valor)
    }
}


class jogada {
    constructor(linha, coluna) {
        this.linha = linha
        this.coluna = coluna
    }

    get valida() {
        return this.linha > 0 && this.coluna > 0
    }

    get invalida() {
        return !this.valida
    }
}


class jogoDaVelhaDOM {
    constructor(tabuleiro, informacoes) {
        this.tabuleiro = tabuleiro
        this.informacoes = informacoes
    }

    inicializar(jogo) {
        this.jogo = jogo
        this.#deixarTabuleiroJogar()
    }

    #deixarTabuleiroJogar() {
        const posicoes = this.tabuleiro.getElementsByClassName("posicao")
        for (let posicao of posicoes) {
            posicao.addEventListener("click", (evento) => {
                if (this.jogo.vencedor) {
                    return
                }

                let posicaoSelecionada = evento.target.attributes
                let linha = +posicaoSelecionada.linha.value
                let coluna = +posicaoSelecionada.coluna.value
                // console.log(`Cliquei em ${linha} ${coluna}`);
                this.jogo.jogar(new jogada(linha, coluna))
                this.informacoes.innerText = this.jogo.status()
                // console.log(this.jogo.toString())
                this.#imprimirSimbolos()
            })
        }
    }

    #imprimirSimbolos() {
		let { tabuleiro } = this.jogo;
		let qtdLinhas = tabuleiro.length;
		let qtdColunas = tabuleiro[0].length;
		let posicoes = this.tabuleiro.getElementsByClassName("posicao");
		for (let linha = 0; linha < qtdLinhas; linha++) {
			for (let coluna = 0; coluna < qtdColunas; coluna++) {
				let indiceDaInterface = linha * qtdLinhas + coluna;
				posicoes[indiceDaInterface].innerText = tabuleiro[linha][coluna]
			}
		}
	}

    zerar() {
        this.jogo.zerar()
        let posicoes = this.tabuleiro.getElementsByClassName("posicao");
        [...posicoes].forEach(posicao => posicao.innerText = "")
        this.informacoes.innerText = this.jogo.status()
    }
}



(function () {
    const botaoIniciar = document.getElementById("iniciar")
    const informacoes = document.getElementById("informacoes")
    const tabuleiro = document.getElementById("tabuleiro")
    const jogo = new jogoDaVelha(new jogadorHumano("❌"), new jogadorHumano("⭕️"))

    const jogoDOM = new jogoDaVelhaDOM(tabuleiro, informacoes)
    jogoDOM.inicializar(jogo)

    botaoIniciar.addEventListener("click", () => {jogoDOM.zerar()})

})()