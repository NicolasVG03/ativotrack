import request from "supertest";
import { app } from "../../main/app";
import { prisma, pool } from "../../infrastructure/database/prisma/cliente";
import { clearDatabase } from "../helpers/clearDatabase";

async function createUserAndGetToken() {
  const response = await request(app).post("/auth/register").send({
    name: "Ana",
    email: "ana@email.com",
    password: "senha123",
  });
  return response.body.token as string;
}

describe("Expenses (integração)", () => {
  let token: string;

  beforeEach(async () => {
    await clearDatabase();
    token = await createUserAndGetToken();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

  it("deve rejeitar acesso sem token", async () => {
    const response = await request(app).get("/expenses");
    expect(response.status).toBe(401);
  });

  it("deve criar uma despesa", async () => {
    const response = await request(app)
      .post("/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "Almoço",
        amount: 35.5,
        date: "2026-06-01T00:00:00.000Z",
        category: "Alimentação",
      });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.description).toBe("Almoço");
  });

  it("deve listar despesas do usuário", async () => {
    await request(app)
      .post("/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "Almoço",
        amount: 35.5,
        date: "2026-06-01T00:00:00.000Z",
        category: "Alimentação",
      });

    const response = await request(app)
      .get("/expenses")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(1);
  });

  it("deve buscar, editar e excluir uma despesa", async () => {
    const created = await request(app)
      .post("/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "Mercado",
        amount: 100,
        date: "2026-06-02T00:00:00.000Z",
        category: "Alimentação",
      });

    const id = created.body.id;

    const getResponse = await request(app)
      .get(`/expenses/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.description).toBe("Mercado");

    const updateResponse = await request(app)
      .put(`/expenses/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "Mercado mensal",
        amount: 150,
        date: "2026-06-02T00:00:00.000Z",
        category: "Alimentação",
      });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.description).toBe("Mercado mensal");
    expect(updateResponse.body.amount).toBe(150);

    const deleteResponse = await request(app)
      .delete(`/expenses/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(deleteResponse.status).toBe(204);

    const getAfterDelete = await request(app)
      .get(`/expenses/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(getAfterDelete.status).toBe(404);
  });

  it("deve retornar resumo de despesas", async () => {
    await request(app)
      .post("/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "Almoço",
        amount: 50,
        date: "2026-06-01T00:00:00.000Z",
        category: "Alimentação",
      });

    await request(app)
      .post("/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "Uber",
        amount: 20,
        date: "2026-06-01T00:00:00.000Z",
        category: "Transporte",
      });

    const response = await request(app)
      .get("/expenses/summary")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(70);
    expect(response.body.count).toBe(2);
    expect(response.body.byCategory["Alimentação"]).toBe(50);
    expect(response.body.byCategory["Transporte"]).toBe(20);
  });
});