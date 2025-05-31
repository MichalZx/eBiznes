describe('Aplikacja sklepu – testy end-to-end', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('1. Powinien załadować listę produktów', () => {
    cy.contains('Produkty');
    cy.get('li').should('have.length.at.least', 1);
    cy.get('li').first().should('be.visible');
  });

  it('2. Powinien umożliwić dodanie produktu do koszyka', () => {
    cy.contains('Dodaj do koszyka').first().should('be.visible');
    cy.contains('Dodaj do koszyka').first().click();
    cy.contains(/dodano|utworzono/i).should('exist');
  });

  it('3. Po dodaniu produktu - koszyk powinien istnieć', () => {
    cy.contains('Dodaj do koszyka').first().click();
    cy.wait(500);
    cy.contains('a', 'Koszyk').click();
    cy.get('li').should('exist');
    cy.get('ul').should('exist');
  });

  it('4. Powinien pokazać nazwę i cenę produktu w koszyku', () => {
    cy.contains('Dodaj do koszyka').first().click();
    cy.contains('a', 'Koszyk').click();
    cy.get('li').first().should('contain.text', '– $');
    cy.get('li').first().should('not.be.empty');
  });

  it('5. Powinien pokazać sumę koszyka', () => {
    cy.contains('Dodaj do koszyka').first().click();
    cy.contains('a', 'Koszyk').click();

    cy.get('p').invoke('text').then(text => {
      const match = text.match(/[\d]+(\.\d{1,2})?/);
      const sum = match ? parseFloat(match[0]) : NaN;
      expect(sum).to.be.greaterThan(0);
    });
  });

  it('6. Przycisk "Kup i zapłać" powinien działać', () => {
    cy.contains('Dodaj do koszyka').first().click();
    cy.contains('a', 'Koszyk').click();
    cy.contains('Kup i zapłać').should('exist').click();
    cy.contains('Transakcja przebiegła pomyślnie').should('exist');
  });

  it('7. Po zakupie koszyk powinien być pusty', () => {
    cy.contains('Dodaj do koszyka').first().click();
    cy.contains('a', 'Koszyk').click();
    cy.contains('Kup i zapłać').click();
    cy.contains('Koszyk jest pusty').should('exist');
  });

  it('8. Nawigacja z koszyka do produktów działa', () => {
    cy.contains('a', 'Koszyk').click();
    cy.get('nav').contains('Produkty').click();
    cy.contains('Produkty').should('exist');
  });

  it('9. Koszyk nie istnieje przed dodaniem produktu', () => {
    cy.contains('a', 'Koszyk').click();
    cy.contains('Koszyk jest pusty').should('exist');
  });

  it('10. Dodanie wielu produktów działa', () => {
    cy.get('button').each(($btn, i) => {
      if ($btn.text().includes('Dodaj do koszyka') && i < 3) {
        cy.wrap($btn).click();
      }
    });

    cy.contains('a', 'Koszyk').click();
    cy.get('li').should('have.length.at.least', 3);
    cy.get('li').eq(0).should('exist');
    cy.get('li').eq(1).should('exist');
    cy.get('li').eq(2).should('exist');
  });

  it('11. Suma koszyka jest większa niż 0 po dodaniu produktu do koszyka', () => {
    cy.get('button').contains('Dodaj do koszyka').first().click();
    cy.contains('a', 'Koszyk').click();
    cy.get('p').invoke('text').then(text => {
    const numericPart = text.replace(/[^\d.]+/, ''); 
    const sum = parseFloat(numericPart);
    expect(sum).to.be.greaterThan(0);
    });
  });

  it('12. Serwer dostępny na porcie 8080', () => {
    cy.request('http://localhost:8080/products').its('status').should('eq', 200);
  });

  it('13. Lista produktów zawiera "Hobbit"', () => {
    cy.contains('Hobbit').should('exist');
  });

  it('14. Koszyk nie zapamiętuje koszyka po wyjściu i wejściu do sklepu', () => {
    cy.contains('Dodaj do koszyka').first().click();
    cy.contains('a', 'Koszyk').click();
    cy.reload();
    cy.get('li').should('not.have.length.at.least', 1);
  });

  it('15. Ładowanie strony tworzy nowego klienta', () => {
    cy.contains('Dodaj do koszyka').first().click();
    cy.reload();
    cy.contains('a', 'Koszyk').click();
    cy.get('li').should('not.exist');
  });

  it('16. Linki w menu działają', () => {
    cy.get('nav').contains('Koszyk').click();
    cy.url().should('include', '/cart');
    cy.get('nav').contains('Produkty').should('exist');
  });

  it('17. Dodanie produktu nie powoduje błędu', () => {
    cy.on('fail', () => {
      throw new Error('Dodanie do koszyka zakończyło się błędem');
    });
    cy.contains('Dodaj do koszyka').first().click();
  });

  it('18. Dodanie i zakup 2 produktów działa poprawnie', () => {
    cy.get('button').each(($btn, i) => {
      if ($btn.text().includes('Dodaj do koszyka') && i < 2) {
        cy.wrap($btn).click();
      }
    });
    cy.contains('a', 'Koszyk').click();
    cy.get('li').should('have.length.at.least', 2);
    cy.contains('Kup i zapłać').click();
    cy.contains('Transakcja przebiegła pomyślnie').should('exist');
  });

  it('19. Nie pokazuje pustego koszyka jeśli są produkty', () => {
    cy.contains('Dodaj do koszyka').first().click();
    cy.contains('a', 'Koszyk').click();
    cy.contains('Koszyk jest pusty').should('not.exist');
  });

  it('20. Wszystkie produkty mają przycisk "Dodaj do koszyka"', () => {
    cy.get('li').each($li => {
      cy.wrap($li).find('button').should('contain', 'Dodaj do koszyka');
    });
  });

  it('21. Przycisk dodania jest aktywny', () => {
    cy.get('button').contains('Dodaj do koszyka').first().should('not.be.disabled');
  });

  it('22. Strona główna zawiera nagłówek', () => {
    cy.get('h1').should('exist').and('be.visible');
  });
});
