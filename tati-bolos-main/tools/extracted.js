
        var produtos = [];
        try { produtos = JSON.parse(localStorage.getItem('tati_products')) || []; } catch(e) { produtos = []; }
        var insumos = [];
        try { insumos = JSON.parse(localStorage.getItem('tati_insumos')) || []; } catch(e) { insumos = []; }
        var encomendas = [];
        try { encomendas = JSON.parse(localStorage.getItem('tati_encomendas')) || []; } catch(e) { encomendas = []; }

        var mesaAtualId = null;
        var ultimaVenda = null;

        var mesasState = null;
        try { mesasState = JSON.parse(localStorage.getItem('tati_mesas')); } catch(e) { mesasState = null; }
        if (!mesasState || typeof mesasState !== 'object') {
            mesasState = {};
            for(var i=1; i<=12; i++) {
                mesasState['mesa_' + i] = { nome: 'Mesa ' + i, itens: [], status: 'livre' };
            }
            mesasState['balcao'] = { nome: 'BalcÃ£o / Viagem', itens: [], status: 'livre' };
        }

        window.mudarAba = function(aba, btn) {
            var botoes = document.querySelectorAll('.tab-btn');
            for(var i=0; i<botoes.length; i++) botoes[i].classList.remove('active');
            
            var secoes = document.querySelectorAll('.secao-painel');
            for(var j=0; j<secoes.length; j++) secoes[j].style.display = 'none';

            if (aba === 'produtos') {
                document.getElementById('secao-produtos').style.display = 'block';
                window.carregarProdutosAdmin();
            } else if (aba === 'insumos') {
                document.getElementById('secao-insumos').style.display = 'block';
                window.carregarInsumosAdmin();
            } else if (aba === 'encomendas') {
                document.getElementById('secao-encomendas').style.display = 'block';
                window.carregarEncomendasAdmin();
            } else if (aba === 'pdv') {
                document.getElementById('secao-pdv').style.display = 'block';
                window.carregarPDV();
            }

            if (btn) btn.classList.add('active');
        };

        window.toggleCampoPromo = function() {
            var isChecked = document.getElementById('promocao').checked;
            document.getElementById('grupo-preco-promo').style.display = isChecked ? 'block' : 'none';
        };

        window.carregarProdutosAdmin = function() {
            var container = document.getElementById('lista-produtos-admin');
            container.innerHTML = produtos.length === 0 ? '<p style="color: #666; text-align: center;">Nenhum produto cadastrado.</p>' : '';

            produtos.forEach(function(produto) {
                var precoDisplay = 'R$ ' + Number(produto.price).toFixed(2);
                if (produto.promocao && produto.preco_promo) {
                    precoDisplay = '<span style="text-decoration: line-through; color: #888;">R$ ' + Number(produto.price).toFixed(2) + '</span> <strong style="color: var(--pink);">R$ ' + Number(produto.preco_promo).toFixed(2) + '</strong>';
                }
                var tagPromo = produto.promocao ? '<span style="color:red; font-size:0.8rem; font-weight:bold;">[PROMO]</span>' : '';

                var html = '<div class="item-list">' +
                    '<div style="display: flex; align-items: center; gap: 10px;">' +
                        '<img src="' + produto.imagem + '" style="width: 45px; height: 45px; object-fit: cover; border-radius: 6px; background: #eee;">' +
                        '<div>' +
                            '<strong>' + produto.name + '</strong> ' + tagPromo + '<br>' +
                            '<span style="font-size: 0.8rem; color: #666;">' + precoDisplay + ' | <em>' + produto.category + '</em></span>' +
                        '</div>' +
                    '</div>' +
                    '<button onclick="excluirProduto(\'' + produto.id + '\')" style="background: #ffebee; color: #c62828; border: none; padding: 6px 10px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 0.8rem;">Excluir</button>' +
                '</div>';
                container.innerHTML += html;
            });
        };

        window.salvarProduto = function(event) {
            event.preventDefault();
            var fileInput = document.getElementById('imagem-file');
            if (!fileInput.files || !fileInput.files[0]) {
                alert('Selecione uma foto!');
                return;
            }

            var file = fileInput.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {
                var novoProduto = {
                    id: 'prod_' + Date.now(),
                    name: document.getElementById('nome').value,
                    desc: document.getElementById('desc').value,
                    price: parseFloat(document.getElementById('preco').value),
                    category: document.getElementById('categoria').value,
                    imagem: e.target.result,
                    promocao: document.getElementById('promocao').checked,
                    preco_promo: document.getElementById('promocao').checked ? parseFloat(document.getElementById('preco-promo').value) : null
                };
                produtos.push(novoProduto);
                localStorage.setItem('tati_products', JSON.stringify(produtos));
                document.getElementById('form-produto').reset();
                document.getElementById('grupo-preco-promo').style.display = 'none';
                window.carregarProdutosAdmin();
                alert('Produto cadastrado com sucesso!');
            };
            reader.readAsDataURL(file);
        };

        window.excluirProduto = function(id) {
            if (confirm('Deseja excluir este produto?')) {
                produtos = produtos.filter(function(p) { return p.id !== id; });
                localStorage.setItem('tati_products', JSON.stringify(produtos));
                window.carregarProdutosAdmin();
            }
        };

        window.salvarInsumo = function(event) {
            event.preventDefault();
            var novoInsumo = {
                id: Date.now(),
                nome: document.getElementById('ins-nome').value,
                unidade: document.getElementById('ins-unidade').value,
                valor: parseFloat(document.getElementById('ins-valor').value),
                fornecedor: document.getElementById('ins-fornecedor').value
            };
            insumos.push(novoInsumo);
            localStorage.setItem('tati_insumos', JSON.stringify(insumos));
            document.getElementById('form-insumo').reset();
            window.carregarInsumosAdmin();
            alert('Insumo cadastrado com sucesso!');
        };

        window.carregarInsumosAdmin = function() {
            var container = document.getElementById('lista-insumos-admin');
            container.innerHTML = insumos.length === 0 ? '<p style="color: #666; text-align: center;">Nenhum insumo cadastrado.</p>' : '';

            insumos.forEach(function(ins) {
                container.innerHTML += '<div class="item-list">' +
                    '<div>' +
                        '<strong>' + ins.nome + '</strong><br>' +
                        '<span style="font-size: 0.8rem; color: #666;">R$ ' + Number(ins.valor).toFixed(2) + ' por ' + ins.unidade + ' | Fornecedor: <em>' + ins.fornecedor + '</em></span>' +
                    '</div>' +
                    '<button onclick="excluirInsumo(' + ins.id + ')" style="background: #ffebee; color: #c62828; border: none; padding: 6px 10px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 0.8rem;">Excluir</button>' +
                '</div>';
            });
        };

        window.excluirInsumo = function(id) {
            insumos = insumos.filter(function(i) { return i.id !== id; });
            localStorage.setItem('tati_insumos', JSON.stringify(insumos));
            window.carregarInsumosAdmin();
        };

        window.carregarEncomendasAdmin = function() {
            var container = document.getElementById('lista-encomendas-admin');
            container.innerHTML = encomendas.length === 0 ? '<p style="color: #666; text-align: center;">Nenhuma encomenda recebida.</p>' : '';

            encomendas.forEach(function(enc, index) {
                var fotoHtml = enc.foto ? '<img src="' + enc.foto + '" onclick="abrirZoom(\'' + enc.foto + '\')" style="width: 65px; height: 65px; object-fit: cover; border-radius: 6px; border: 1px solid #ccc; margin-top: 5px; cursor: pointer;">' : '<span style="font-size:0.8rem; color:#888;">Sem foto de referÃªncia</span>';
                
                container.innerHTML += '<div class="card" style="border-left: 4px solid var(--pink); margin-bottom: 15px; background: #fafafa;">' +
                    '<div style="display: flex; justify-content: space-between;">' +
                        '<strong style="font-size: 1.05rem; color: var(--pink);">' + enc.nomeCliente + '</strong>' +
                        '<span style="font-size: 0.8rem; color: #666;">' + enc.dataPedido + '</span>' +
                    '</div>' +
                    '<p style="margin: 5px 0; font-size: 0.9rem;"><strong>Tel:</strong> ' + enc.telefone + '</p>' +
                    '<p style="margin: 5px 0; font-size: 0.9rem;"><strong>Retirada:</strong> ' + enc.dataRetirada + ' Ã s ' + enc.horaRetirada + '</p>' +
                    '<p style="margin: 5px 0; font-size: 0.9rem;"><strong>OpÃ§Ã£o:</strong> ' + enc.opcaoEscolhida + '</p>' +
                    '<p style="margin: 5px 0; font-size: 0.9rem;"><strong>Detalhes:</strong> ' + enc.descricao + '</p>' +
                    '<p style="margin: 5px 0; font-size: 0.9rem;"><strong>Valor:</strong> R$ ' + Number(enc.total).toFixed(2) + ' | <strong>Pagamento:</strong> ' + enc.statusPagamento + ' (' + enc.formaPagamento + ')</p>' +
                    '<div style="margin-top: 8px;">' +
                        '<label style="font-size: 0.8rem; font-weight: bold;">Foto de ReferÃªncia:</label><br>' + fotoHtml +
                    '</div>' +
                    '<div style="margin-top: 15px; text-align: right;">' +
                        '<button onclick="removerEncomenda(' + index + ')" style="background: #ffebee; color: #c62828; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 0.8rem;">Concluir / Remover</button>' +
                    '</div>' +
                '</div>';
            });
        };

        window.abrirZoom = function(url) {
            var modal = document.getElementById('modal-zoom');
            var img = document.getElementById('img-zoom-conteudo');
            if (modal && img) {
                img.src = url;
                modal.style.display = 'flex';
            }
        };

        window.fecharZoom = function() {
            var modal = document.getElementById('modal-zoom');
            if (modal) modal.style.display = 'none';
        };

        window.removerEncomenda = function(index) {
            if (confirm('Deseja remover esta encomenda da lista?')) {
                encomendas.splice(index, 1);
                localStorage.setItem('tati_encomendas', JSON.stringify(encomendas));
                window.carregarEncomendasAdmin();
            }
        };

        window.carregarPDV = function() {
            var grid = document.getElementById('grid-mesas');
            grid.innerHTML = '';

            Object.keys(mesasState).forEach(function(key) {
                var m = mesasState[key];
                var totalMesa = 0;
                for(var i=0; i<m.itens.length; i++) {
                    totalMesa += m.itens[i].preco * m.itens[i].quantidade;
                }
                var isOcupado = m.itens.length > 0;
                
                var bgCor = isOcupado ? '#fff0f3' : '#f1f8e9';
                var bordaCor = isOcupado ? 'var(--pink)' : '#c8e6c9';
                var textoStatus = isOcupado ? 'R$ ' + Number(totalMesa).toFixed(2) : 'Livre';
                var iconeStatus = isOcupado ? '<span style="color:var(--pink); font-weight:bold;">[OCUPADO]</span>' : '<span style="color:green; font-weight:bold;">[LIVRE]</span>';

                grid.innerHTML += '<div onclick="abrirModalMesa(\'' + key + '\')" style="background: ' + bgCor + '; border: 2px solid ' + bordaCor + '; border-radius: 10px; padding: 12px; text-align: center; cursor: pointer;">' +
                    '<div style="font-size: 0.75rem; margin-bottom: 5px;">' + iconeStatus + '</div>' +
                    '<div style="font-weight: bold; font-size: 1.05rem; margin: 5px 0; color: var(--chocolate);">' + m.nome + '</div>' +
                    '<div style="font-size: 0.85rem; color: ' + (isOcupado ? 'var(--pink)' : '#2e7d32') + '; font-weight: bold;">' + textoStatus + '</div>' +
                '</div>';
            });
        };

        window.abrirModalMesa = function(key) {
            mesaAtualId = key;
            var m = mesasState[key];
            document.getElementById('titulo-modal-mesa').innerText = 'Mesa: ' + m.nome;
            
            var selectProd = document.getElementById('select-produto-mesa');
            selectProd.innerHTML = '';
            
            if (produtos.length === 0) {
                selectProd.innerHTML = '<option value="">Cadastre produtos primeiro</option>';
            } else {
                produtos.forEach(function(p) {
                    var precoEfet = (p.promocao && p.preco_promo) ? p.preco_promo : p.price;
                    selectProd.innerHTML += '<option value="' + p.id + '" data-nome="' + p.name + '" data-preco="' + precoEfet + '">' + p.name + ' (R$ ' + Number(precoEfet).toFixed(2) + ')</option>';
                });
            }

            window.atualizarItensMesaUI();
            document.getElementById('modal-mesa').style.display = 'flex';
        };

        window.fecharModalMesa = function() {
            document.getElementById('modal-mesa').style.display = 'none';
        };

        window.adicionarItemMesa = function() {
            if (!mesaAtualId) return;
            var selectProd = document.getElementById('select-produto-mesa');
            var opt = selectProd.options[selectProd.selectedIndex];
            if (!opt || !opt.value) return;

            var produtoId = opt.value;
            var nomeProd = opt.getAttribute('data-nome');
            var precoProd = parseFloat(opt.getAttribute('data-preco'));
            var qtd = parseInt(document.getElementById('qtd-produto-mesa').value) || 1;

            var m = mesasState[mesaAtualId];
            var itemExistente = null;
            for(var i=0; i<m.itens.length; i++) {
                if(String(m.itens[i].id) === String(produtoId)) itemExistente = m.itens[i];
            }

            if (itemExistente) {
                itemExistente.quantidade += qtd;
            } else {
                m.itens.push({ id: produtoId, name: nomeProd, preco: precoProd, quantidade: qtd });
            }

            localStorage.setItem('tati_mesas', JSON.stringify(mesasState));
            window.atualizarItensMesaUI();
            window.carregarPDV();
        };

        window.removerItemMesa = function(produtoId) {
            if (!mesaAtualId) return;
            var m = mesasState[mesaAtualId];
            m.itens = m.itens.filter(function(i) { return String(i.id) !== String(produtoId); });
            localStorage.setItem('tati_mesas', JSON.stringify(mesasState));
            window.atualizarItensMesaUI();
            window.carregarPDV();
        };

        window.atualizarItensMesaUI = function() {
            if (!mesaAtualId) return;
            var m = mesasState[mesaAtualId];
            var listaUl = document.getElementById('lista-itens-mesa');
            var totalEl = document.getElementById('total-valor-mesa');
            listaUl.innerHTML = '';

            if (m.itens.length === 0) {
                listaUl.innerHTML = '<p style="color: #888; text-align: center; font-size: 0.85rem; margin: 10px 0;">Nenhum item adicionado.</p>';
                totalEl.innerText = '0.00';
                return;
            }

            var total = 0;
            m.itens.forEach(function(item) {
                var sub = item.preco * item.quantidade;
                total += sub;
                listaUl.innerHTML += '<li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; font-size: 0.85rem; border-bottom: 1px solid #eee; padding-bottom: 4px;">' +
                    '<span>' + item.quantidade + 'x ' + item.name + '</span>' +
                    '<span>R$ ' + Number(sub).toFixed(2) + ' <button onclick="removerItemMesa(\'' + item.id + '\')" style="background:none; border:none; color:red; cursor:pointer; font-weight:bold; margin-left:8px;">X</button></span>' +
                '</li>';
            });
            totalEl.innerText = Number(total).toFixed(2);
        };

        window.salvarEFecharMesa = function() {
            window.fecharModalMesa();
            window.carregarPDV();
        };

        window.abrirCaixaMesa = function() {
            if (!mesaAtualId) return;
            var m = mesasState[mesaAtualId];
            if (m.itens.length === 0) {
                alert('Esta mesa nÃ£o possui itens consumidos!');
                return;
            }

            window.fecharModalMesa();

            document.getElementById('titulo-modal-caixa').innerText = 'Caixa - ' + m.nome;
            var resumoUl = document.getElementById('resumo-itens-caixa');
            resumoUl.innerHTML = '';
            var subtotal = 0;

            m.itens.forEach(function(item) {
                var sub = item.preco * item.quantidade;
                subtotal += sub;
                resumoUl.innerHTML += '<div style="display:flex; justify-content:space-between; margin-bottom:2px;"><span>' + item.quantidade + 'x ' + item.name + '</span><span>R$ ' + Number(sub).toFixed(2) + '</span></div>';
            });

            document.getElementById('caixa-subtotal').innerText = Number(subtotal).toFixed(2);
            document.getElementById('caixa-desconto').value = 0;
            document.getElementById('caixa-pagamento').value = 'pix';
            document.getElementById('campos-dinheiro').style.display = 'none';
            document.getElementById('caixa-valor-recebido').value = '';
            document.getElementById('caixa-troco').innerText = '0.00';

            window.calcularTotalCaixa();
            document.getElementById('modal-caixa').style.display = 'flex';
        };

        window.fecharModalCaixa = function() {
            document.getElementById('modal-caixa').style.display = 'none';
        };

        window.mudarFormaPagamentoCaixa = function() {
            var forma = document.getElementById('caixa-pagamento').value;
            var camposDinheiro = document.getElementById('campos-dinheiro');
            if (forma === 'dinheiro') {
                camposDinheiro.style.display = 'block';
                document.getElementById('caixa-valor-recebido').focus();
            } else {
                camposDinheiro.style.display = 'none';
            }
        };

        window.calcularTotalCaixa = function() {
            var subtotal = parseFloat(document.getElementById('caixa-subtotal').innerText) || 0;
            var descontoPercent = parseFloat(document.getElementById('caixa-desconto').value) || 0;
            
            var valorDesconto = (subtotal * descontoPercent) / 100;
            var totalFinal = subtotal - valorDesconto;
            if (totalFinal < 0) totalFinal = 0;

            document.getElementById('caixa-total-final').innerText = Number(totalFinal).toFixed(2);
            window.calcularTroco();
        };

        window.calcularTroco = function() {
            var totalFinal = parseFloat(document.getElementById('caixa-total-final').innerText) || 0;
            var valorRecebido = parseFloat(document.getElementById('caixa-valor-recebido').value) || 0;
            var troco = valorRecebido - totalFinal;

            document.getElementById('caixa-troco').innerText = troco >= 0 ? Number(troco).toFixed(2) : '0.00';
        };

        window.concluirPagamentoCaixa = function() {
            if (!mesaAtualId) return;

            var formaPagto = document.getElementById('caixa-pagamento').value;
            var totalFinal = parseFloat(document.getElementById('caixa-total-final').innerText) || 0;
            var subtotal = parseFloat(document.getElementById('caixa-subtotal').innerText) || 0;
            var desconto = parseFloat(document.getElementById('caixa-desconto').value) || 0;
            var valorRecebido = parseFloat(document.getElementById('caixa-valor-recebido').value) || 0;
            var troco = parseFloat(document.getElementById('caixa-troco').innerText) || 0;

            if (formaPagto === 'dinheiro' && valorRecebido < totalFinal) {
                alert('O valor recebido Ã© menor que o total a pagar!');
                return;
            }

            var m = mesasState[mesaAtualId];

            ultimaVenda = {
                mesa: m.nome,
                itens: m.itens.slice(),
                subtotal: subtotal,
                desconto: desconto,
                total: totalFinal,
                pagamento: formaPagto,
                recebido: valorRecebido,
                troco: troco
            };

            m.itens = [];
            localStorage.setItem('tati_mesas', JSON.stringify(mesasState));
            
            window.fecharModalCaixa();
            window.carregarPDV();

            document.getElementById('modal-recibo').style.display = 'flex';
        };

        window.fecharModalRecibo = function() {
            document.getElementById('modal-recibo').style.display = 'none';
            ultimaVenda = null;
        };

        window.enviarComprovanteWhatsApp = function() {
            if (!ultimaVenda) return;
            var telefone = prompt("Digite o WhatsApp do cliente (com DDD, ex: 11999999999):");
            if (!telefone) return;

            var v = ultimaVenda;
            var msg = "[COMPROVANTE DE CONSUMO - Tati Amor Doce]\n";
            msg += "Mesa: " + v.mesa + "\n----------------------------\n";
            v.itens.forEach(function(i) {
                msg += "- " + i.quantidade + "x " + i.name + " (R$ " + Number(i.preco * i.quantidade).toFixed(2) + ")\n";
            });
            msg += "----------------------------\n";
            msg += "Subtotal: R$ " + Number(v.subtotal).toFixed(2) + "\n";
            if(v.desconto > 0) msg += "Desconto: " + v.desconto + "%\n";
            msg += "Total Pago: R$ " + Number(v.total).toFixed(2) + "\n";
            msg += "Forma de Pagto: " + v.pagamento.toUpperCase() + "\n";
            if(v.pagamento === 'dinheiro') {
                msg += "Recebido: R$ " + Number(v.recebido).toFixed(2) + "\n";
                msg += "Troco: R$ " + Number(v.troco).toFixed(2) + "\n";
            }
            msg += "\nObrigado pela preferÃªncia! Volte sempre!";

            var url = "https://wa.me/55" + telefone + "?text=" + encodeURIComponent(msg);
            window.open(url, '_blank');
            window.fecharModalRecibo();
        };
    


        window.imprimirComprovantePDF = function() {
            if (!ultimaVenda) return;
            var v = ultimaVenda;

            var janela = window.open('', '', 'width=400,height=600');
            janela.document.write('<html><head><title>Comprovante</title></head><body style="font-family: monospace; text-align: center;">');
            janela.document.write('<h2 style="color: #d81b60; margin-bottom: 5px;">Tati Amor Doce</h2>');
            janela.document.write('<hr><p><b>' + v.mesa + '</b></p><div style="text-align: left;">');
            
            v.itens.forEach(function(i) {
                janela.document.write('<div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span>' + i.quantidade + 'x ' + i.name + '</span><span>R$ ' + Number(i.preco * i.quantidade).toFixed(2) + '</span></div>');
            });

            janela.document.write('</div><hr>');
            janela.document.write('<div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span>Subtotal:</span><span>R$ ' + Number(v.subtotal).toFixed(2) + '</span></div>');

            if(v.desconto > 0) {
                janela.document.write('<div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span>Desconto:</span><span>' + v.desconto + '%</span></div>');
            }

            janela.document.write('<div style="display: flex; justify-content: space-between; font-weight: bold; margin-top: 10px;"><span>TOTAL:</span><span>R$ ' + Number(v.total).toFixed(2) + '</span></div>');
            janela.document.write('<div style="display: flex; justify-content: space-between; margin-top: 5px;"><span>Pagamento:</span><span>' + v.pagamento.toUpperCase() + '</span></div>');

            if(v.pagamento === 'dinheiro') {
                janela.document.write('<div style="display: flex; justify-content: space-between; margin-top: 5px;"><span>Recebido:</span><span>R$ ' + Number(v.recebido).toFixed(2) + '</span></div>');
                janela.document.write('<div style="display: flex; justify-content: space-between; margin-top: 5px;"><span>Troco:</span><span>R$ ' + Number(v.troco).toFixed(2) + '</span></div>');
            }

            janela.document.write('<hr><p>Obrigado pela preferÃªncia!<br>Volte sempre!</p>');
            janela.document.write('</body></html>');
            
            janela.document.close();
            janela.focus();
            setTimeout(function() {
                janela.print();
            }, 500);
            
            window.fecharModalRecibo();
        };

        window.onload = function() {
            window.carregarProdutosAdmin();
        };
    