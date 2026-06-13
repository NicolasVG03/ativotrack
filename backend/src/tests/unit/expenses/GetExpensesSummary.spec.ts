import { GetExpensesSummary } from "../../../application/use-cases/expenses/GetExpensesSummary";
import { CreateExpense } from "../../../application/use-cases/expenses/CreateExpense";
import { InMemoryExpenseRepository } from "../../repositories/InMemoryExpenseRepository";

describe("GetExpensesSummary", () => {
  let expenseRepository: InMemoryExpenseRepository;
  let sut: GetExpensesSummary;

  beforeEach(async () => {
    expenseRepository = new InMemoryExpenseRepository();
    const create = new CreateExpense(expenseRepository);

    await create.execute({ userId: "user-1", description: "Almoço", amount: 50, date: new Date(), category: "Alimentação" });
    await create.execute({ userId: "user-1", description: "Mercado", amount: 150, date: new Date(), category: "Alimentação" });
    await create.execute({ userId: "user-1", description: "Uber", amount: 30, date: new Date(), category: "Transporte" });
    await create.execute({ userId: "user-2", description: "Academia", amount: 100, date: new Date(), category: "Saúde" });

    sut = new GetExpensesSummary(expenseRepository);
  });

  it("deve calcular o total correto do usuário", async () => {
    const result = await sut.execute({ userId: "user-1" });

    expect(result.total).toBe(230);
  });

  it("deve retornar a contagem correta de despesas", async () => {
    const result = await sut.execute({ userId: "user-1" });

    expect(result.count).toBe(3);
  });

  it("deve agrupar corretamente os totais por categoria", async () => {
    const result = await sut.execute({ userId: "user-1" });

    expect(result.byCategory).toEqual({
      Alimentação: 200,
      Transporte: 30,
    });
  });

  it("não deve incluir despesas de outro usuário no resumo", async () => {
    const result = await sut.execute({ userId: "user-1" });

    expect(result.byCategory["Saúde"]).toBeUndefined();
  });

  it("deve retornar resumo vazio para usuário sem despesas", async () => {
    const result = await sut.execute({ userId: "user-sem-despesas" });

    expect(result.total).toBe(0);
    expect(result.count).toBe(0);
    expect(result.byCategory).toEqual({});
  });
});
