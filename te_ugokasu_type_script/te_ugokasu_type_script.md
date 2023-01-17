# Chapter 1 TypeScriptの概要
## Section 1 JavaScriptとECMAScript
- ECMAScriptとは
  - JavaScriptの言語仕様が標準化された**言語＊*
  - 多くの場合イコールの関係だが、実行環境や詳細な機能、シンタックスについて意識するときは使い分ける
- コンパイラ
  - JavaScriptの文脈で出てくるときは、任意の下位バージョンのECMAScriptへのトランスパイラを指す
  - 下位のバージョンでは存在しない機能を任意の環境で動かすには、トランスパイラに加えてPolyfillを使う必要がある
- スーパーセットとしてのECMAScript
  - すべてのECMAScriptは後方互換性を保っている
- TypeScriptとECMAScript
  - TypeScriptは特定のECMAScriptのスーパーセット
  - 特定バージョンのECMAScriptのシンタックスを全てカバーしつつ、型システムなどの機能も持っている言語
## Section 2 型とは
- データ型
  - 型は正確にはデータ型
  - 数値型、文字列型 etc...
- 型システム
  - プログラムに存在する値をデータ型で分類し、そのプログラムが正しく振る舞うことを保証する機構
- 静的型付けと動的型付け
  - 静的型付けはコンパイルの段階で型検査を行う
  - 動的型付けは実行時に型検査を行う
## Section 3 なぜTypeScriptを使うのか
- 安全なコードを書ける
  - 変更のコストを小さくできる
- エディタの保管機能を利用できる
- TypeScriptのスーパーセットなので導入コストが低い
## Section 4 TypeScriptのコンパイル
- TypeScriptはブラウザやNode.jsで実行する前にJavaScriptに変換する必要がある
- tscコマンド
  - TypeScriptをJavaScriptにコンパイルできる
  - 型チェックを行う
  - 型アノテーションを削除し、ECMAScriptの記法へ変換する
    - 任意のECMAScriptバージョンに変換できる
  - tsconfig.jsonでコンパイルの設定を変更できる
    - ソースマップの有無、型チェックの強度、構文チェックなど
  - Babelなどでもコンパイルはできるが、型チェックはtscコマンドが必要
# Chapter 2 基本的なシンタックス
## Section 5 環境構築
- `tsc`
  - JavaScriptファイルを出力するとともに、ランタイムでエラーが発生しうる、型が誤ったコードを事前に検出できる
- `tsconfig.json`
  - `tsc`コマンドのオプション引数として設定値を渡すのは大変なので、`tsconfig.json`で管理する
  - 通常jsonはコメントが記述できないが、このファイルは`tsc`がコメントを無視してくれるので記述可能
## Section 6 基本的な型
- string型
- number型
  - 正、負、小数、`NaN`、`Infinity`、`-Infinity`
  - `BigInt`を扱う場合はbigint型を使う
- boolean型
  - 真偽値のみ(他のfalseyな値は含まない)
- 配列型
  - `[]`記法
    - `const list: number[] = [1, 2, 3]`
  - `Array<>`記法(ジェネリクス)
    - `const list: Array<number> = [1, 2, 3]`
- undefined型 / null型
  - 単独で使うことは少なく、number型かundefined型(ユニオン型)として使うことが多い
  - `strictNullChecks`オプションをtrueにしないと全ての型が`undefined`と`null`を許容してしまう
- 関数型
  - void型
    - 何も返さない関数に使う(実際にはundefinedが返るのだが、値として使えなくなる)
    - JavaScriptにはない概念
- object型 / オブジェクト型
  - object型
    - 実際の開発では使わない
  - オブジェクト型(本書独自の呼び方)
    - キーに型情報を追記した形
    - 存在しないキーにアクセスできない
      - optional(`?`)を追記することであってもなくても良いという指定ができる
      - `readonly`を追記することでそのプロパティを再代入不可にできる
- any型
  - 型システムを放棄するのと同義なので基本的に使わない
## Section 7 interface
名前付きのオブジェクト型を宣言するための機能
```typescript
interface Person {
  name: string
  age: number
}

const person: Person = {
  name: 'Michael Jackson',
  age: 20,
}
```
メソッドの型も表現できる
```typescript
interface Person {
  // 書き方１
  sayHello: (name: string) => viod
  // 書き方2
  sayBye(name:string): void
}
```
関数型の宣言にも使えるが、混同しやすいのであまり使わない
```typescript
interface greet {
  (name: string): void
}

const sayHello: greet = (name: string) => {
  console.log(`Hello, ${name}!`)
}
```
- メリット
  - dryにできる
  - 型に命名できる
## Section 8 型推論
### プリミティブ型の型推論
```typescript
let total = 123 // number型に推論される
let isPositive = 0 < total // boolean型に推論される
```
`null`はJavaScriptでは厳密にいうとプリミティブ型ではないが、TypeScriptではnull型として推論される
### 配列型・オブジェクト型・関数型の型推論
```typescript
const nameList = ['dog', 'cat', 'bird'] // string[]型に推論される

const person = {
  name: 'Michael Jackson',
  age: 20
} // { name: string, age: number }型に推論されている

const sayHello = (name: string): string => {
  return `Hello, ${name}!`
} // 引数にstring型をとってstring型を返す関数型として推論される

// 実際は文字列を返すことが自明なので返り値の型アノテーションは省略可
const sayBye = (name: string) => {
  return `Bye, ${name}!`
}
```
### 型推論とリテラル型
```typescript
// イミュータブルな場合はリテラル型に推論される
const name1 = 'John' // nameは'John'型に推論される
let name2 = 'Paul' // nameはstring型に推論される

const person = {
  name: 'Steve'
} // constで定義されているが、オブジェクトはミュータブルなためnameはstring型として推論される
```
- リテラル型
  - プリミティブな値の中で文字列、数値、真偽値のみがとれる型
  - 'John'型はstring型のサブタイプ
