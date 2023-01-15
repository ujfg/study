# Chapter 1
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
## TypeScriptのコンパイル
- TypeScriptはブラウザやNode.jsで実行する前にJavaScriptに変換する必要がある
- tscコマンド
  - TypeScriptをJavaScriptにコンパイルできる
  - 型チェックを行う
  - 型アノテーションを削除し、ECMAScriptの記法へ変換する
    - 任意のECMAScriptバージョンに変換できる
  - tsconfig.jsonでコンパイルの設定を変更できる
    - ソースマップの有無、型チェックの強度、構文チェックなど
  - Babelなどでもコンパイルはできるが、型チェックはtscコマンドが必要