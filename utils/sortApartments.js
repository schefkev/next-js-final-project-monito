export default function sortApartmentsById(apartments) {
  return apartments.sort((a, b) => a.id - b.id);
}
