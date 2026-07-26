import { registerUserSchema } from "../src/modules/identity/application/register-user.schema";

const validResult = registerUserSchema.safeParse({
  name: "Kennedy",
  email: "kennedy@example.com",
  password: "12345678",
  passwordConfirmation: "12345678",
});

console.log("Cadastro válido:");
console.log(validResult);

const invalidResult = registerUserSchema.safeParse({
  name: "K",
  email: "email-invalido",
  password: "123",
  passwordConfirmation: "456",
});

console.log("\nCadastro inválido:");
console.log(invalidResult);
