const sayHello = (name: string) => {
  return `Hello, ${name}!`
}

process.stdout.write(sayHello('John'))