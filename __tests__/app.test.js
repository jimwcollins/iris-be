process.env.NODE_ENV = "test"
const app = require("../app")
const request = require("supertest")
const connection = require("../db/connection");



describe("/api", () => {

    afterAll(() => {
        return connection.destroy()
    })

    it("responds with a 200 ok", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then((res) => {
                expect(res.body.topics).toEqual(expect.any(Array));
                expect(Object.keys(res.body.topics[0])).toEqual
                    (expect.arrayContaining(["slug", "description"]))            
        })
    })





});