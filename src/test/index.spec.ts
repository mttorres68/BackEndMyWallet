import generateTokenProvides from "../provider/generateTokenProvides"

it("should sum", () => {
  const token = generateTokenProvides.execute("123")
  console.log(token) // Adiciona um console.log para verificar o tipo
  expect(typeof token).toBe("string")
  expect(token).not.toBe("")
})
