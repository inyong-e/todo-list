export default function generateUniqueId() {
  const timestamp = Date.now();

  const randomNumber = Math.random();

  const uniqueId = `${timestamp}${Math.floor(randomNumber * 1000)}`;

  return uniqueId;
}
