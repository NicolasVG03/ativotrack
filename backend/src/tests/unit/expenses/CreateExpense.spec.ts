import { CreateExpense } from "../../../application/use-cases/expenses/CreateExpense";
import { AppError } from "../../../application/errors/AppError";
import { InMemoryExpenseRepository } from "../../repositories/InMemoryExpenseRepository";

describe("CreateExpense", () => {
  let expenseRepository: InMemoryExpenseRepository;
  let sut: CreateExpense;

  beforeEach(() => {
    expenseRepository = new InMemoryExpenseRepository();
    sut = new CreateExpense(expenseRepository);
  });

  it("deve criar uma despesa e retorná-la com id gerado", async () => {
    const result = await sut.execute({
      userId: "user-1",
      description: "Almoço",
      amount: 35.5,
      date: new Date("2026-06-01"),
      category: "Alimentação",
    });

    expect(result.id).toBeDefined();
    expect(result.description).toBe("Almoço");
    expect(result.amount).toBe(35.5);
    expect(result.userId).toBe("user-1");
  });

  it("deve persistir a despesa no repositório", async () => {
    const result = await sut.execute({
      userId: "user-1",
      description: "Mercado",
      amount: 200,
      date: new Date("2026-06-02"),
      category: "Alimentação",
    });

    const found = await expenseRepository.findById(result.id);
    expect(found).not.toBeNull();
    expect(found!.description).toBe("Mercado");
  });

  it("deve lançar AppError ao tentar criar despesa com valor zero", async () => {
    await expect(
      sut.execute({
        userId: "user-1",
        description: "Inválida",
        amount: 0,
        date: new Date(),
        category: "Outros",
      }),
    ).rejects.toThrow(AppError);
  });

  it("deve lançar AppError ao tentar criar despesa com valor negativo", async () => {
    await expect(
      sut.execute({
        userId: "user-1",
        description: "Inválida",
        amount: -50,
        date: new Date(),
        category: "Outros",
      }),
    ).rejects.toThrow(AppError);
  });
});
