import sortApartmentsById from '../sortApartments';

describe('sortApartmentsById function', () => {
  const apartments = [
    { id: 3, name: 'Apartment C' },
    { id: 1, name: 'Apartment A' },
    { id: 2, name: 'Apartment B' },
  ];

  it('should sort apartments by ID in ascending order', () => {
    const sortedApartments = sortApartmentsById(apartments);

    expect(sortedApartments).toHaveLength(3);
    expect(sortedApartments[0]).toEqual({ id: 1, name: 'Apartment A' });
    expect(sortedApartments[1]).toEqual({ id: 2, name: 'Apartment B' });
    expect(sortedApartments[2]).toEqual({ id: 3, name: 'Apartment C' });
  });
});
