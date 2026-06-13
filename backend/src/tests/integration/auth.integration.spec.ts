import request from "supertest";
import { app } from "../../main/app";
import { prisma, pool } from "../../infrastructure/database/prisma/cliente";
import { clearDatabase } from "../helpers/clearDatabase";

describe("Auth (integração)", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

  it("deve registrar um usuário com sucesso", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Ana",
      email: "ana@email.com",
      password: "senha123",
    });

    expect(response.status).toBe(201);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe("ana@email.com");
  });

  it("não deve registrar email duplicado", async () => {
    await request(app).post("/auth/register").send({
      name: "Ana",
      email: "ana@email.com",
      password: "senha123",
    });

    const response = await request(app).post("/auth/register").send({
      name: "Ana 2",
      email: "ana@email.com",
      password: "outrasenha",
    });

    expect(response.status).toBe(409);
  });

  it("deve fazer login com credenciais corretas", async () => {
    await request(app).post("/auth/register").send({
      name: "Ana",
      email: "ana@email.com",
      password: "senha123",
    });

    const response = await request(app).post("/auth/login").send({
      email: "ana@email.com",
      password: "senha123",
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it("deve rejeitar login com senha incorreta", async () => {
    await request(app).post("/auth/register").send({
      name: "Ana",
      email: "ana@email.com",
      password: "senha123",
    });

    const response = await request(app).post("/auth/login").send({
      email: "ana@email.com",
      password: "senhaerrada",
    });

    expect(response.status).toBe(401);
  });
});