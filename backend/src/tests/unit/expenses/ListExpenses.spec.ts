import { ListExpenses } from "../../../application/use-cases/expenses/ListExpenses";
import { CreateExpense } from "../../../application/use-cases/expenses/CreateExpense";
import { InMemoryExpenseRepository } from "../../repositories/InMemoryExpenseRepository";

describe("ListExpenses", () => {
  let expenseRepository: InMemoryExpenseRepository;
  let sut: ListExpenses;

  beforeEach(async () => {
    expenseRepository = new InMemoryExpenseRepository();
    const create = new CreateExpense(expenseRepository);

    await create.execute({ userId: "user-1", description: "Almoço", amount: 30, date: new Date("2026-06-01"), category: "Alimentação" });
    await create.execute({ userId: "user-1", description: "Uber", amount: 25, date: new Date("2026-06-05"), category: "Transporte" });
    await create.execute({ userId: "user-1", description: "Cinema", amount: 40, date: new Date("2026-06-10"), category: "Lazer" });
    await create.execute({ userId: "user-2", description: "Jantar", amount: 80, date: new Date("2026-06-01"), category: "Alimentação" });

    sut = new ListExpenses(expenseRepository);
  });

  it("deve retornar apenas as despesas do usuário", async () => {
    const result = await sut.execute({ userId: "user-1" });

    expect(result).toHaveLength(3);
    expect(result.every((e) => e.userId === "user-1")).toBe(true);
  });

  it("deve filtrar por categoria", async () => {
    const result = await sut.execute({ userId: "user-1", category: "Alimentação" });

    expect(result).toHaveLength(1);
    expect(result[0].description).toBe("Almoço");
  });

  it("deve filtrar por data de início (from)", async () => {
    const result = await sut.execute({ userId: "user-1", from: new Date("2026-06-05") });

    expect(result).toHaveLength(2);
    expect(result.map((e) => e.description)).toEqual(expect.arrayContaining(["Uber", "Cinema"]));
  });

  it("deve filtrar por data de fim (to)", async () => {
    const result = await sut.execute({ userId: "user-1", to: new Date("2026-06-05") });

    expect(result).toHaveLength(2);
    expect(result.map((e) => e.description)).toEqual(expect.arrayContaining(["Almoço", "Uber"]));
  });

  it("deve retornar lista vazia para usuário sem despesas", async () => {
    const result = await sut.execute({ userId: "user-sem-despesas" });

    expect(result).toHaveLength(0);
  });
});
