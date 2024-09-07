// describe("server", () => {
//   it("status check returns 200", async () => {
//     await supertest(createServer())
//       .get("/status")
//       .expect(200)
//       .then((res) => {
//         expect(res.body.ok).toBe(true);
//       });
//
//      const res = await testClient(app).status.$get()
//
//     expect(await res.).toBe(true)
//   });
//
//   it("message endpoint says hello", async () => {
//     await supertest(createServer())
//       .get("/message/jared")
//       .expect(200)
//       .then((res) => {
//         expect(res.body.message).toBe("hello jared");
//       });
//   });
// });
