export default eventHandler(async (event) => {
  const { id } = await readBody(event);
  const findUser = MOCK_USERS.find((item) => item.id === id);

  return useResponseSuccess(findUser);
});
