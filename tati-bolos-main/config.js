const CONFIG = {
    products: JSON.parse(localStorage.getItem('tati_products')) || [
        { id: 1, name: "Coxinha de Frango", desc: "Empanado na Panko, frito na hora e super crocante.", price: 16.90, category: "salgados", imagem: "imagens/coxinha.jpg", promocao: false },
        { id: 2, name: "Coxinha de Costela", desc: "Empanado na Panko, frito na hora e super crocante.", price: 18.90, category: "salgados", imagem: "imagens/costela.jpg", promocao: false },
        { id: 3, name: "Bolinho de Carne Seca", desc: "Empanado na Panko, frito na hora e super crocante.", price: 18.90, category: "salgados", imagem: "imagens/carneseca.jpg", promocao: false },
        { id: 4, name: "Salgados Assados", desc: "Consulte os sabores disponíveis na vitrine.", price: 12.90, category: "salgados", imagem: "imagens/assados.jpg", promocao: false },
        { id: 5, name: "Refrigerante Lata", desc: "Geladinho para acompanhar seu pedido.", price: 7.00, category: "bebidas", imagem: "imagens/lata.jpg", promocao: false },
        { id: 6, name: "Refrigerante 200 ml", desc: "Portátil e refrescante.", price: 4.00, category: "bebidas", imagem: "imagens/refri200ml.jpg", promocao: false },
        { id: 7, name: "Água", desc: "Água mineral pura.", price: 4.00, category: "bebidas", imagem: "imagens/agua.jpg", promocao: false },
        { id: 8, name: "Café Coado", desc: "Quentinho e fresquinho.", price: 5.90, category: "cafeteria", imagem: "imagens/cafe.jpg", promocao: false },
        { id: 9, name: "Café com Leite", desc: "A combinação perfeita.", price: 7.90, category: "cafeteria", imagem: "imagens/cafeleite.jpg", promocao: false },
        { id: 10, name: "Cappuccino Tradicional", desc: "Cremoso e saboroso.", price: 12.90, category: "cafeteria", imagem: "imagens/cappuccino.jpg", promocao: false },
        { id: 11, name: "Cappuccino Especial", desc: "Com borda de Nutella + chantilly.", price: 15.90, category: "cafeteria", imagem: "imagens/cappuccinoespecial.jpg", promocao: true, preco_promo: 13.90, promo_expires_at: Date.now() + 864000000 },
        { id: 12, name: "Chocolate Quente Tradicional", desc: "Encorpado e reconfortante.", price: 14.90, category: "cafeteria", imagem: "imagens/chocolatequente.jpg", promocao: false },
        { id: 13, name: "Chocolate Quente Especial", desc: "Estilo Campos do Jordão (borda de Nutella + marshmallow).", price: 17.90, category: "cafeteria", imagem: "imagens/camposjordao.jpg", promocao: false },
        { id: 14, name: "Cookie de Nutella", desc: "Feito na hora, quentinho e irresistível!", price: 18.90, category: "cookies", imagem: "imagens/cookienutella.jpg", promocao: false },
        { id: 15, name: "Cookie de Kinder", desc: "Feito na hora, quentinho e irresistível!", price: 18.90, category: "cookies", imagem: "imagens/cookiekinder.jpg", promocao: false }
    ],
    insumos: JSON.parse(localStorage.getItem('tati_insumos')) || [],
    encomendas: JSON.parse(localStorage.getItem('tati_encomendas')) || []
};