/// <reference types="cypress"/>

describe('funcionalidades de produtos', () => {
  let token
  before(() => {
    cy.token('fulano@qa.com', 'teste').then(tkn => {token = tkn})
  });

  it('listar produto', () => {
        cy.request({
            method:'GET',
            url: 'http://localhost:3000/produtos'
          }).then((response) => {
            expect(response.body.produtos[1].nome).to.equal('Tênis LV')
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
            expect(response.duration).to.be.lessThan(30)
          })
    
        });

  it('registrar produto', () => {
      let produto = `Camiseta Oakley ${Math.floor(Math.random() * 1000)}`
      cy.request({
        method:'POST',
        url: 'http://localhost:3000/produtos',
        body: {
          "nome": produto,
          "preco": 159,
          "descricao": "Vestuário",
          "quantidade": 500
        },
         headers:{authorization: token}
      }).then((response) => {
        expect(response.status).to.equal(201)
        expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        expect(response.duration).to.be.lessThan(50)
      })
      
    
    });
  it('verificar produto repetido', () => {
      cy.cadastroproduto(token, 'Camiseta Okaley', 150, "descricao",  500)
      .then((response) => {
        expect(response.status).to.equal(400)
        expect(response.body.message).to.equal('Já existe produto com esse nome')
       
  })
});
   
  it('editar produto', () => {
    cy.request('http://localhost:3000/produtos').then(response =>{
    let id = response.body.produtos[0]._id
    cy.request({
      method:'PUT',
      url: `http://localhost:3000/produtos/${id}`,
      headers: {authorization: token},
      body: {
        "nome": "Tênis",
        "preco": 3500,
        "descricao": "Calçado",
        "quantidade": 500
      }
    }).then(response => {
        expect(response.body.message).to.equal('Registro alterado com sucesso')
      })
    })
  })
  it('deletar produto', () => {
        let produto = `Camiseta Oakley ${Math.floor(Math.random() * 1000)}`
        cy.cadastroproduto(token, produto, 150, "Vestuário",  500)
        .then(response => {
        let id = response.body._id
        cy.request({
          method: 'DELETE',
          url: `http://localhost:3000/produtos/${id}`,
          headers: {authorization: token}
        }).then(response => {
          expect(response.status).to.equal(200)
      })
    })
  });
 })
    
    

  
