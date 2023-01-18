import request from "supertest";
import {UserType} from "../userTypes";
import {server} from "../main";

describe("api/users", () => {
    let user: UserType;

    beforeAll(async () => {
        console.log("Tests started...");
        server;
    });

    afterAll((done) => {
        server.close(done);
        console.log("Test finished.");
    });

    describe("GET", () => {
        it("GET /api/users, expect 200", () => {
            return request(server).get("/api/users").expect(200);
        });

        it("GET /api/users/123, UUID wrong, expect 400", () => {
            return request(server).get("/api/users/123").expect(400);
        });

        it("GET /api/users/f062ff50-d07d-48af-9cfb-b9e954cfc5d7erd, UUID wrong, expect 400", async () => {
            return request(server)
                .get("/api/users/f062ff50-d07d-48af-9cfb-b9e954cfc5d7erd")
                .expect(400);
        });

        it("GET /api/users/44c90064-8a53-40e7-bc90-3ca94d8b23ec, UUID doesn't exist, expect 404", async () => {
            return request(server)
                .get("/api/users/44c90064-8a53-40e7-bc90-3ca94d8b23ec")
                .expect(404);
        });
    });


    describe("POST",  () => {
        it("POST /api/users, expect 201", async () => {
            const res =  await request(server)
                .post("/api/users")
                .send({
                    username: "Sergey",
                    age: 38,
                    hobbies: ['run', 'bike']
                })
                .expect(201);
            return res
        });



        it("POST /api/users request body does contain wrong fields, expect 400", async () => {
            return request(server)
                .post("/api/users")
                .send({
                    username: "Sergey",
                    age1: 38,
                    hobbies: ['run', 'bike']
                })
                .expect(400);
        });

        it("POST /api/users request body does not contain required fields, expect 400", async () => {
            return request(server).post("/api/users").send({
                username: "Sergey",
            }).expect(400);
        });
    });

    describe("PUT",   () => {


        it("PUT /api/users/{userId}, expect 200", async () => {
            const getUser = await request(server)
                .post("/api/users")
                .send({
                    username: "Sergey",
                    age: 38,
                    hobbies: ['run', 'bike']
                })
            user = getUser.body
            const res = await request(server)
                .put(`/api/users/${user.id}`)
                .send({
                    age: 17,
                })
                .expect(200);
            return res
        });

        it("GET /api/users/updatedUser, updated username saved id DB", async () => {
            const res: request.Response = await request(server).get(`/api/users/${user.id}`);
            expect(res.body.age).toEqual(17);
            return res
        });

        it("PUT /api/users/{userId} userId is invalid (not uuid), expect 400", async () => {
            const res = await request(server)
                .put(`/api/users/123`)
                .send({
                    hobbies: ['sleeping', 'coding']
                })
                .expect(400);
            return res
        });

        it("PUT /api/users/{userId} record with id === userId doesn't exist, expect 404", async () => {
            const res = await request(server)
                .put(`/api/users/ef72c9f6-12e0-4266-9df1-a2ffcee45428`)
                .send({
                    hobbies: ['drinking'],
                })
                .expect(404);
            return res
        });
    });
    describe("DELETE", () => {
        it("DELETE /api/users/44c90064-8a53-40e7-bc90-3ca94d8b23ec, expect 204", async () => {
            const getUser = await request(server)
                .post("/api/users")
                .send({
                    username: "Sergey",
                    age: 38,
                    hobbies: ['run', 'bike']
                })
            user = getUser.body
            return request(server).delete(`/api/users/${user.id}`).expect(204);
        });


        it("DELETE /api/users/123 userId is invalid (not uuid), expect 400", async () => {
            return request(server).delete(`/api/users/123`).expect(400);
        });

        it("PUT /api/users/{userId} record with id === userId doesn't exist, expect 404", async () => {
            await request(server)
                .delete(`/api/users/ef72c9f6-12e0-4266-9df1-a2ffcee45428`)
                .expect(404);
            return
        });
    });
    describe("NON EXISTING RESOURCE", () => {
        it("GET /some-non/existing/resource, expect 404", () => {
            return request(server).get("/some-non/existing/resource").expect(404);
        });
    });
});