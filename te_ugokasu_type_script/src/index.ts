const readLine = async () => {
  const input: string = await new Promise(
    (resolve) => process.stdin.once('data', (data) => resolve(data.toString()))
  )
  return input.trim()
}

const printLine = (text: string, breakLine: boolean = true) => {
  process.stdout.write(text + (breakLine ? '\n' : ''))
}

const promptInput = async (text: string) => {
  printLine(`\n${text}\n`, false)
  return readLine()
}

const promptSelect = async <T extends string>(text: string, values: readonly T[]): Promise<T> => {
  printLine(`\n${text}\n`, false)
  values.forEach((value) => {
    printLine(`- ${value}`)
  })
  printLine('> ', false)

  const input = await readLine() as T
  if (values.includes(input)) {
    return input
  } else {
    return promptSelect<T>(text, values)
  }
}

const nextActions = ['play again', 'exit'] as const
type NextAction = typeof nextActions[number]

class GameProcedure {
  currentGameTitle: string = 'janken'
  currentGame = new Janken()

  public async start() {
    await this.play()
  }

  private end() {
    printLine('ゲームを終了しました。')
    process.exit()
  }

  private async play() {
    printLine(`===\n${this.currentGameTitle} を開始します。\n===`)
    await this.currentGame.setting()
    await this.currentGame.play()

    this.currentGame.end()
    const action = await promptSelect<NextAction>('ゲームを続けますか？', nextActions)
    switch (action) {
      case 'play again':
        await this.play()
        break
      case 'exit':
        this.end()
        break
      default:
        const neverValue: never = action
        throw new Error(`${neverValue} is an invalid action.`)
    }
  }
}

const modes = ['normal', 'hard'] as const
type Mode = typeof modes[number]

class HitAndBlow {
  private readonly answerSource = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  answer: string[] = []
  private tryCount = 0
  private mode: Mode = 'normal'

  async setting() {
    this.mode = await promptSelect<Mode>('モードを入力してください', modes)
    const answerLength = this.getAnswerLength()
    while (this.answer.length < answerLength) {
      const randNum = Math.floor(Math.random() * this.answerSource.length)
      const selectedItem = this.answerSource[randNum]
      if (!this.answer.includes(selectedItem)) {
        this.answer.push(selectedItem)
      }
    }
  }

  async play() {
    printLine(this.answer.join(','))
    const inputArr = (await promptInput(`[,]区切りで${this.getAnswerLength()}つの数字を入力してください`)).split(',')

    if (!this.validate(inputArr)) {
      printLine('無効な入力です')
      await this.play()
      return
    }

    printLine('hoge')
    
    const result = this.check(inputArr)
    
    if (result.hit !== this.answer.length ) {
      // 不正解
      printLine(`---\nHit: ${result.hit}\nBlow: ${result.blow}\n---`)
      this.tryCount += 1
      await this.play()
    } else {
      // 正解
      this.tryCount += 1
    }
  }

  end() {
    printLine(`正解です！\n試行回数: ${this.tryCount}回`)
    this.reset()
  }

  private reset() {
    this.answer = []
    this.tryCount = 0
  }

  private check(input: string[]) {
    let hitCount = 0
    let blowCount = 0

    input.forEach((val, index) => {
      if (val === this.answer[index]) {
        hitCount += 1
      } else if (this.answer.includes(val)) {
        blowCount += 1
      }
    })

    return {
      hit: hitCount,
      blow: blowCount,
    }
  }

  private validate(inputArr: string[]) {
    const isLengthValid = inputArr.length === this.answer.length
    const isAllAnswerSourceOption = inputArr.every((val) => this.answerSource.includes(val))
    const isAllDifferentValues = inputArr.every((val, i) => inputArr.indexOf(val) === i)
    return isLengthValid && isAllAnswerSourceOption && isAllDifferentValues
  }

  private getAnswerLength() {
    switch (this.mode) {
      case 'normal':
        return 3
      case 'hard':
        return 4
      default:
        const neverValue: never = this.mode
        throw new Error(`${neverValue} は無効なモードです`)
    }
  }
}

const handSigns = ['rock', 'paper', 'scissors'] as const
type HandSign = typeof handSigns[number]

class Janken {
  private rounds = 0
  private currentRound = 0
  private results = {
    'win': 0,
    'lose': 0,
    'draw': 0,
  }

  async setting() {
    const rounds = Number(await promptInput('何本勝負にしますか？'))
    if (Number.isInteger(rounds) && 0 < rounds) {
      this.rounds = rounds
    } else {
      await this.setting()
    }
  }

  async play() {    
    const userHandSign = await promptSelect('手を選んでください', handSigns)
    const computerHandSign = handSigns[Math.floor(Math.random() * handSigns.length)]
    const result = Janken.judge(userHandSign, computerHandSign)

    let text: string
    switch (result) {
      case 'win':
        text = '勝ち'
        break
      case 'lose':
        text = '負け'
        break
      case 'draw':
        text = '引き分け'
        break
    }
    this.results[result] += 1
    this.currentRound+= 1
    printLine(`結果: ${text} あなた: ${userHandSign}, わたし: ${computerHandSign}`)

    if (this.rounds === this.currentRound) {
      printLine(`勝ち: ${this.results.win} 負け: ${this.results.lose} 引き分け: ${this.results.draw}`)
    } else {
      await this.play()
    }
  }

  end() {
    this.reset()
  }

  private reset() {
    this.currentRound = 0
    this.rounds = 0
    this.results = {
      'win': 0,
      'lose': 0,
      'draw': 0,
    }
  }

  static judge(userHandSign: HandSign, ComputerHandSign: HandSign) {
    if (userHandSign === 'rock') {
      if (ComputerHandSign === 'paper') { return 'lose'}
      if (ComputerHandSign === 'scissors') { return 'win'}
    } else if (userHandSign === 'paper') {
      if (ComputerHandSign === 'scissors') { return 'lose'}
      if (ComputerHandSign === 'rock') { return 'win'}
    } else if (userHandSign === 'scissors') {
      if (ComputerHandSign === 'rock') { return 'lose'}
      if (ComputerHandSign === 'paper') { return 'win'}
    }

    return 'draw'
  }
}

// 即時関数で囲まないと、prompyInputがpromiseインスタンスを返して処理が次に進んでしまう
;(async () => {
  new GameProcedure().start()
})()