import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// TORNA AS FUNÇÕES DO FIRESTORE GLOBAIS PARA O ADMIN
window.updateDoc = updateDoc;
window.deleteDoc = deleteDoc;
window.doc = doc;
window.setDoc = setDoc;
window.getDoc = getDoc;
window.addDoc = addDoc;
window.collection = collection;

const LOJA_ID = "tati_bolos";
const firebaseConfig = {
    apiKey: "AIzaSyAMIrJ1TQ9vTaoj9xd6CVb967EIW3Nbn4w",
    authDomain: "saas-tati-amor-doce.firebaseapp.com",
    projectId: "saas-tati-amor-doce",
    storageBucket: "saas-tati-amor-doce.firebasestorage.app",
    messagingSenderId: "1085621176314",
    appId: "1:1085621176314:web:e28377f6dd100851edc643"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
window.db = db;

console.log("🔥 Config.js e Firebase conectados com sucesso!");

// Objeto global de controle
window.appData = {
    products: [],
    insumos: [],
    encomendas: []
};

// ==========================================
// 1. MÓDULO DE PRODUTOS (NUVEM)
// ==========================================
window.obterProdutosDaNuvem = async function() {
    try {
        const querySnapshot = await getDocs(collection(db, "produtos"));
        let lista = [];
        querySnapshot.forEach((docSnap) => {
            lista.push({ firestoreId: docSnap.id, id: docSnap.id, ...docSnap.data() });
        });
        return lista;
    } catch (e) {
        console.error("Erro ao buscar produtos da nuvem:", e);
        return [];
    }
};

window.salvarProdutoNaNuvem = async function(produto) {
    try {
        produto.lojaId = LOJA_ID;
        await addDoc(collection(db, "produtos"), produto);
        return true;
    } catch (e) {
        console.error("Erro ao salvar produto:", e);
        return false;
    }
};

window.excluirDaNuvem = async function(firestoreId) {
    try {
        await deleteDoc(doc(db, "produtos", firestoreId));
        return true;
    } catch (e) {
        console.error("Erro ao excluir produto:", e);
        return false;
    }
};


// ==========================================
// 2. MÓDULO DE INSUMOS (NUVEM)
// ==========================================
window.obterInsumosDaNuvem = async function() {
    try {
        const querySnapshot = await getDocs(collection(db, "insumos"));
        let lista = [];
        querySnapshot.forEach((docSnap) => {
            lista.push({ firestoreId: docSnap.id, id: docSnap.id, ...docSnap.data() });
        });
        return lista;
    } catch (e) {
        console.error("Erro ao buscar insumos:", e);
        return [];
    }
};

window.salvarInsumoNaNuvem = async function(novoInsumo) {
    try {
        await addDoc(collection(db, "insumos"), novoInsumo);
        return true;
    } catch (e) {
        console.error("Erro ao salvar insumo:", e);
        return false;
    }
};

window.excluirInsumoDaNuvem = async function(firestoreId) {
    try {
        await deleteDoc(doc(db, "insumos", firestoreId));
        return true;
    } catch (e) {
        console.error("Erro ao excluir insumo:", e);
        return false;
    }
};


// ==========================================
// 3. MÓDULO DE OPÇÕES DE ENCOMENDA (NUVEM)
// ==========================================
window.obterOpcoesEncomendaDaNuvem = async function() {
    try {
        const querySnapshot = await getDocs(collection(db, "opcoes_encomenda"));
        let lista = [];
        querySnapshot.forEach((docSnap) => {
            lista.push({ firestoreId: docSnap.id, id: docSnap.id, ...docSnap.data() });
        });
        return lista;
    } catch (e) {
        console.error("Erro ao buscar opções de encomenda:", e);
        return [];
    }
};

window.salvarOpcaoEncomendaNaNuvem = async function(novaOpcao) {
    try {
        await addDoc(collection(db, "opcoes_encomenda"), novaOpcao);
        return true;
    } catch (e) {
        console.error("Erro ao salvar opção de encomenda:", e);
        return false;
    }
};

window.atualizarOpcaoEncomendaNaNuvem = async function(firestoreId, dadosAtualizados) {
    try {
        await updateDoc(doc(db, "opcoes_encomenda", firestoreId), dadosAtualizados);
        return true;
    } catch (e) {
        console.error("Erro ao atualizar opção de encomenda:", e);
        return false;
    }
};

window.excluirOpcaoEncomendaDaNuvem = async function(firestoreId) {
    try {
        await deleteDoc(doc(db, "opcoes_encomenda", firestoreId));
        return true;
    } catch (e) {
        console.error("Erro ao excluir opção de encomenda:", e);
        return false;
    }
};
window.salvarNaNuvem = window.salvarProdutoNaNuvem;
// Atalhos globais para garantir compatibilidade com o admin.html antigo
window.salvarNaNuvem = window.salvarProdutoNaNuvem;

window.excluirProdutoAdmin = async function(firestoreId) {
    if (!confirm("Deseja realmente excluir este produto da nuvem?")) return;
    let sucesso = await window.excluirDaNuvem(firestoreId);
    if (sucesso) {
        alert("Produto excluído com sucesso!");
        window.carregarProdutosAdmin();
    } else {
        alert("Erro ao excluir produto.");
    }
};

// Executa o carregamento se estiver na aba de produtos
document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById('lista-produtos-admin') || document.getElementById('lista-produtos')) {
        window.carregarProdutosAdmin();
    }
});
// --- COMPATIBILIDADE DE PRODUTOS ---
window.salvarNaNuvem = async function(colecao, dados) {
    try {
        if (colecao === "produtos") {
            await window.salvarProdutoNaNuvem(dados);
        } else {
            await addDoc(collection(db, colecao), dados);
        }
        return true;
    } catch (e) {
        console.error("Erro no salvarNaNuvem:", e);
        throw e;
    }
};

window.excluirProduto = async function(firestoreId) {
    if (!confirm('Deseja excluir este produto da nuvem?')) return;
    var sucesso = await window.excluirDaNuvem(firestoreId);
    if (sucesso) {
        alert("Produto excluído com sucesso!");
        if (typeof carregarProdutosAdmin === 'function') {
            carregarProdutosAdmin();
        }
    } else {
        alert("Erro ao excluir o produto.");
    }
};
// ==========================================
// 4. MÓDULO DE CLIENTES (NUVEM)
// ==========================================
window.obterClientesDaNuvem = async function() {
    try {
        const querySnapshot = await getDocs(collection(db, "clientes"));
        let lista = [];
        querySnapshot.forEach((docSnap) => {
            lista.push({ firestoreId: docSnap.id, id: docSnap.id, ...docSnap.data() });
        });
        return lista;
    } catch (e) {
        console.error("Erro ao buscar clientes da nuvem:", e);
        return [];
    }
};

window.salvarClienteNaNuvem = async function(novoCliente) {
    try {
        await addDoc(collection(db, "clientes"), novoCliente);
        return true;
    } catch (e) {
        console.error("Erro ao salvar cliente:", e);
        return false;
    }
};

window.excluirClienteDaNuvem = async function(firestoreId) {
    try {
        await deleteDoc(doc(db, "clientes", firestoreId));
        return true;
    } catch (e) {
        console.error("Erro ao excluir cliente:", e);
        return false;
    }
};

// Atalhos de compatibilidade para o admin.html
// Gestão Completa de Clientes (Listagem, Edição e Salvamento)
window.clientesAdminCache = {};

window.carregarClientesAdmin = async function() {
    let container = document.getElementById('lista-clientes-admin') || document.getElementById('lista-clientes');
    if (!container) return;
    
    container.innerHTML = "<p style='padding: 10px;'>Carregando clientes da nuvem...</p>";
    
    var tentativas = 0;
    while (!window.db && tentativas < 25) {
        await new Promise(resolve => setTimeout(resolve, 200));
        tentativas++;
    }

    if (!window.db) {
        container.innerHTML = '<p style="color: red; text-align: center;">Erro: Conexão com Firebase falhou.</p>';
        return;
    }

    try {
        var querySnapshot = await window.getDocs(window.collection(window.db, "clientes"));
        window.clientesAdminCache = {};
        var clientesNuvem = [];

        querySnapshot.forEach(function(docSnap) {
            var cli = docSnap.data();
            cli.firestoreId = docSnap.id;
            window.clientesAdminCache[cli.firestoreId] = cli;
            clientesNuvem.push(cli);
        });

        if (clientesNuvem.length === 0) {
            container.innerHTML = "<p style='padding: 10px; color: #666;'>Nenhum cliente cadastrado na nuvem.</p>";
            return;
        }

        container.innerHTML = "";

        clientesNuvem.forEach(cli => {
            var cliId = cli.firestoreId || cli.id;
            var telefoneLimpo = (cli.whatsapp || cli.telefone || '').replace(/\D/g, '');
            var badgePedidos = (cli.pedidos || 0) > 5 ? '<span style="background: gold; color: #000; padding: 2px 6px; border-radius: 4px; font-size: 11px; margin-left: 5px;">VIP</span>' : '';

            container.innerHTML += `
                <div class="card" style="border-left: 4px solid var(--pink); background: #fff; padding: 12px; margin-bottom: 8px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${cli.nome || cli.name || 'Cliente'}</strong> ${badgePedidos}<br>
                        <small style="color: #666;">CPF: ${cli.cpf || 'Não informado'} | Tel: ${telefoneLimpo || cli.whatsapp || cli.telefone || 'Sem telefone'} | Pedidos: ${cli.pedidos || 0}</small>
                    </div>
                    <div style="display: flex; gap: 6px;">
                        <button onclick="somarPedidoCliente('${cliId}', ${cli.pedidos || 0})" style="background: #28a745; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer;" title="Adicionar Pedido">+ Pedido</button>
                        <button onclick="prepararEdicaoCliente('${cliId}')" style="background: #ff9800; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer;" title="Editar">✏️ Editar</button>
                        <button onclick="excluirClienteAdmin('${cliId}')" style="background: #ff4d4d; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer;" title="Excluir">Excluir</button>
                    </div>
                </div>
            `;
        });
    } catch (err) {
        console.error("Erro ao carregar clientes:", err);
        container.innerHTML = "<p style='color: red; padding: 10px;'>Erro ao carregar clientes do banco.</p>";
    }
};

window.editandoClienteId = null;

window.prepararEdicaoCliente = function(cliId) {
    var cli = window.clientesAdminCache[cliId];
    if (!cli) {
        alert("Erro: Cliente não encontrado no cache.");
        return;
    }

    window.editandoClienteId = cliId;

    // Seleção robusta dos inputs do formulário de clientes
    var formCliente = document.getElementById('form-cliente') || document.querySelector('form');
    
    var inputNome = document.getElementById('cli-nome') || document.getElementById('nome') || (formCliente ? formCliente.querySelectorAll('input')[0] : null);
    var inputCpf = document.getElementById('cli-cpf') || document.getElementById('cpf');
    var inputWhats = document.getElementById('cli-whatsapp') || document.getElementById('whatsapp') || document.getElementById('telefone');
    var inputEnd = document.getElementById('cli-endereco') || document.getElementById('endereco');
    var inputObs = document.getElementById('cli-obs') || document.getElementById('obs') || document.querySelector('textarea');

    if (inputNome) inputNome.value = cli.nome || '';
    if (inputCpf) inputCpf.value = cli.cpf || '';
    if (inputWhats) inputWhats.value = cli.whatsapp || cli.telefone || '';
    if (inputEnd) inputEnd.value = cli.endereco || '';
    if (inputObs) inputObs.value = cli.obs || '';

    var btnSalvar = document.querySelector('#form-cliente button[type="submit"]') || document.querySelector('form button[type="submit"]');
    if (btnSalvar) btnSalvar.innerText = 'Atualizar Cliente 🎁';
    
    if (formCliente) {
        window.scrollTo({ top: formCliente.offsetTop - 50, behavior: 'smooth' });
    }
};

window.salvarCliente = async function(event) {
    event.preventDefault(); 
    var formCliente = document.getElementById('form-cliente') || document.querySelector('form');
    
    var inputNome = document.getElementById('cli-nome') || document.getElementById('nome') || (formCliente ? formCliente.querySelectorAll('input')[0] : null);
    var inputCpf = document.getElementById('cli-cpf') || document.getElementById('cpf');
    var inputWhats = document.getElementById('cli-whatsapp') || document.getElementById('whatsapp') || document.getElementById('telefone');
    var inputEnd = document.getElementById('cli-endereco') || document.getElementById('endereco');
    var inputObs = document.getElementById('cli-obs') || document.getElementById('obs') || document.querySelector('textarea');

    var nome = inputNome ? inputNome.value.trim() : '';
    var cpf = inputCpf ? inputCpf.value.trim() : '';
    var whatsapp = inputWhats ? inputWhats.value.trim() : '';
    var endereco = inputEnd ? inputEnd.value.trim() : '';
    var obs = inputObs ? inputObs.value.trim() : '';

    if (!nome) return alert("Preencha o nome do cliente!");

    var dadosCliente = {
        cpf: cpf,
        nome: nome,
        whatsapp: whatsapp,
        endereco: endereco,
        obs: obs
    };

    try {
        if (window.editandoClienteId) {
            await window.updateDoc(window.doc(window.db, "clientes", window.editandoClienteId), dadosCliente);
            alert("Cliente atualizado com sucesso!");
            window.editandoClienteId = null;
            var btnSalvar = document.querySelector('#form-cliente button[type="submit"]') || document.querySelector('form button[type="submit"]');
            if(btnSalvar) btnSalvar.innerText = 'Salvar Cliente 🎁';
        } else {
            dadosCliente.id = 'cli_' + Date.now();
            dadosCliente.pedidos = 0;
            dadosCliente.criadoEm = new Date().toLocaleString();
            await window.addDoc(window.collection(window.db, "clientes"), dadosCliente);
            alert("Cliente cadastrado na nuvem com sucesso!");
        }

        if (formCliente) formCliente.reset();
        if (typeof window.carregarClientesAdmin === 'function') {
            window.carregarClientesAdmin();
        }
    } catch (err) {
        console.error("Erro ao salvar cliente:", err);
        alert("Erro ao salvar cliente: " + err.message);
    }
};

window.excluirClienteAdmin = async function(firestoreId) {
    if (!confirm("Deseja realmente excluir este cliente da nuvem?")) return;
    try {
        await window.deleteDoc(window.doc(window.db, "clientes", firestoreId));
        alert("Cliente excluído com sucesso!");
        window.carregarClientesAdmin();
    } catch (err) {
        console.error("Erro ao excluir:", err);
        alert("Erro ao excluir cliente.");
    }
};

document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById('lista-clientes-admin') || document.getElementById('lista-clientes')) {
        window.carregarClientesAdmin();
    }
});

// ==========================================
// 5. MÓDULO DE FUNCIONÁRIOS (NUVEM)
// ==========================================
window.obterFuncionariosDaNuvem = async function() {
    try {
        const querySnapshot = await getDocs(collection(db, "funcionarios"));
        let lista = [];
        querySnapshot.forEach((docSnap) => {
            lista.push({ firestoreId: docSnap.id, id: docSnap.id, ...docSnap.data() });
        });
        return lista;
    } catch (e) {
        console.error("Erro ao buscar funcionários:", e);
        return [];
    }
};

window.salvarFuncionarioNaNuvem = async function(novoFuncionario) {
    try {
        await addDoc(collection(db, "funcionarios"), novoFuncionario);
        return true;
    } catch (e) {
        console.error("Erro ao salvar funcionário:", e);
        return false;
    }
};

window.excluirFuncionarioDaNuvem = async function(firestoreId) {
    try {
        await deleteDoc(doc(db, "funcionarios", firestoreId));
        return true;
    } catch (e) {
        console.error("Erro ao excluir funcionário:", e);
        return false;
    }
};

// Compatibilidade com o admin.html
window.funcionariosAdminCache = {};

window.carregarFuncionariosAdmin = async function() {
    let container = document.getElementById('lista-funcionarios-admin') || document.getElementById('lista-funcionarios');
    if (!container) return;
    
    container.innerHTML = "<p style='padding: 10px;'>Carregando funcionários da nuvem...</p>";
    
    var tentativas = 0;
    while (!window.db && tentativas < 25) {
        await new Promise(resolve => setTimeout(resolve, 200));
        tentativas++;
    }

    if (!window.db) {
        container.innerHTML = '<p style="color: red; text-align: center;">Erro: Conexão com Firebase falhou.</p>';
        return;
    }

    try {
        var querySnapshot = await window.getDocs(window.collection(window.db, "funcionarios"));
        window.funcionariosAdminCache = {};
        var funcionariosNuvem = [];
        
        querySnapshot.forEach(function(docSnap) {
            var func = docSnap.data();
            func.firestoreId = docSnap.id;
            window.funcionariosAdminCache[func.firestoreId] = func;
            funcionariosNuvem.push(func);
        });

        if (funcionariosNuvem.length === 0) {
            container.innerHTML = "<p style='padding: 10px; color: #666;'>Nenhum funcionário cadastrado na nuvem.</p>";
            return;
        }

        container.innerHTML = "";

        funcionariosNuvem.forEach(f => {
            var fId = f.firestoreId || f.id;
            var acc = f.acessos || {};
            var permissoesStr = [acc.produtos?'Produtos':'', acc.encomendas?'Encomendas':'', acc.pdv?'PDV':'', acc.pedidos?'Pedidos Online':''].filter(Boolean).join(', ') || 'Nenhuma';

            container.innerHTML += `
                <div style="background: white; border: 1px solid #ccc; padding: 12px; border-radius: 8px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="color: var(--pink); font-size: 1.05rem;">${f.nome || f.name}</strong> (${f.funcao || f.cargo || 'Cargo'})<br>
                        <span style="font-size: 0.85rem; color: #555;">Tel: ${f.telefone || 'N/A'} | Salário: R$ ${Number(f.salario || 0).toFixed(2)}</span><br>
                        <span style="font-size: 0.8rem; color: #777;">Acessos permitidos: <strong>${permissoesStr}</strong></span><br>
                        <span style="font-size: 0.8rem; color: #888;">Senha: <code style="background:#eee; padding:2px 4px; border-radius:4px;">${f.senha || ''}</code></span>
                    </div>
                    <div style="display: flex; gap: 5px;">
                        <button onclick="prepararEdicaoFuncionario('${fId}')" style="background: #ff9800; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">✏️ Editar</button>
                        <button onclick="excluirFuncionarioAdmin('${fId}')" style="background: #ffebee; color: #c62828; border: none; padding: 6px 10px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 0.8rem;">Excluir</button>
                    </div>
                </div>
            `;
        });
    } catch (err) {
        console.error("Erro ao carregar funcionários:", err);
        container.innerHTML = "<p style='color: red; padding: 10px;'>Erro ao carregar funcionários do banco.</p>";
    }
};

window.excluirFuncionarioAdmin = async function(firestoreId) {
    if (!confirm("Deseja realmente excluir este funcionário da nuvem?")) return;
    try {
        await window.deleteDoc(window.doc(window.db, "funcionarios", firestoreId));
        alert("Funcionário excluído com sucesso!");
        window.carregarFuncionariosAdmin();
    } catch (err) {
        console.error("Erro ao excluir:", err);
        alert("Erro ao excluir funcionário.");
    }
};

document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById('lista-funcionarios-admin') || document.getElementById('lista-funcionarios')) {
        window.carregarFuncionariosAdmin();
    }
});

// ==========================================
// 6. MÓDULO DE PDV, MESAS E VENDAS (NUVEM)
// ==========================================
window.obterMesasDaNuvem = async function() {
    try {
        const querySnapshot = await getDocs(collection(db, "mesas"));
        let mesasObj = {};
        
        if (querySnapshot.empty) {
            let mesasIniciais = {
                'mesa_1': { nome: 'Mesa 01', itens: [] },
                'mesa_2': { nome: 'Mesa 02', itens: [] },
                'mesa_3': { nome: 'Mesa 03', itens: [] },
                'mesa_4': { nome: 'Mesa 04', itens: [] },
                'mesa_5': { nome: 'Mesa 05', itens: [] },
                'mesa_6': { nome: 'Mesa 06', itens: [] },
                'balcao': { nome: 'Balcão', itens: [] },
                'viagem': { nome: 'Viagem / Retirada', itens: [] }
            };
            for (let key in mesasIniciais) {
                await setDoc(doc(db, "mesas", key), mesasIniciais[key]);
            }
            return mesasIniciais;
        }

        querySnapshot.forEach((docSnap) => {
            mesasObj[docSnap.id] = docSnap.data();
        });

        // Garante que se já existia o banco mas faltava balcão/viagem, ele injeta na hora
        if (!mesasObj['balcao']) {
            mesasObj['balcao'] = { nome: 'Balcão', itens: [] };
            await setDoc(doc(db, "mesas", 'balcao'), mesasObj['balcao']);
        }
        if (!mesasObj['viagem']) {
            mesasObj['viagem'] = { nome: 'Viagem / Retirada', itens: [] };
            await setDoc(doc(db, "mesas", 'viagem'), mesasObj['viagem']);
        }

        return mesasObj;
    } catch (e) {
        console.error("Erro ao buscar mesas da nuvem:", e);
        return {};
    }
};

window.salvarMesaNaNuvenState = async function(mesasStateObj) {
    try {
        for (let key in mesasStateObj) {
            await setDoc(doc(db, "mesas", key), mesasStateObj[key]);
        }
        return true;
    } catch (e) {
        console.error("Erro ao salvar estado das mesas:", e);
        return false;
    }
};

window.salvarVendaNaNuvem = async function(venda) {
    try {
        await addDoc(collection(db, "vendas_mesas"), venda);
        return true;
    } catch (e) {
        console.error("Erro ao salvar venda na nuvem:", e);
        return false;
    }
};
// Garante que o PDV e as mesas carregam automaticamente ao abrir a página
document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById('grid-mesas')) {
        window.carregarPDV();
    }
});

// ==========================================
// 7. MÓDULO DE PEDIDOS ONLINE (NUVEM)
// ==========================================
window.obterPedidosOnlineDaNuvem = async function() {
    try {
        const querySnapshot = await getDocs(collection(db, "pedidos_online"));
        let lista = [];
        querySnapshot.forEach((docSnap) => {
            lista.push({ firestoreId: docSnap.id, id: docSnap.id, ...docSnap.data() });
        });
        return lista;
    } catch (e) {
        console.error("Erro ao buscar pedidos online:", e);
        return [];
    }
};

window.salvarPedidoOnlineNaNuvem = async function(novoPedido) {
    try {
        await addDoc(collection(db, "pedidos_online"), novoPedido);
        return true;
    } catch (e) {
        console.error("Erro ao salvar pedido online:", e);
        return false;
    }
};

window.atualizarStatusPedidoOnlineNaNuvem = async function(firestoreId, novoStatus) {
    try {
        await updateDoc(doc(db, "pedidos_online", firestoreId), { status: novoStatus });
        return true;
    } catch (e) {
        console.error("Erro ao atualizar status do pedido:", e);
        return false;
    }
};

window.excluirPedidoOnlineDaNuvem = async function(firestoreId) {
    try {
        await deleteDoc(doc(db, "pedidos_online", firestoreId));
        return true;
    } catch (e) {
        console.error("Erro ao excluir pedido online:", e);
        return false;
    }
};

window.concluirPedidoOnlineNaNuvem = async function(firestoreId) {
    try {
        // Atualiza o status do pedido para 'concluido' na nuvem
        await updateDoc(doc(db, "pedidos_online", firestoreId), { 
            status: 'concluido',
            dataConclusao: new Date().toLocaleString()
        });
        return true;
    } catch (e) {
        console.error("Erro ao concluir pedido online:", e);
        return false;
    }
};

// ==========================================
// 8. MÓDULO DE ZONAS DE FRETE (NUVEM)
// ==========================================
window.obterZonasFreteDaNuvem = async function() {
    try {
        const querySnapshot = await getDocs(collection(db, "zonas_frete"));
        let lista = [];
        if (querySnapshot.empty) {
            // Zonas padrão iniciais
            let padrao = [
                { nome: "Zona 1 (Centro, Vila Nova, Vila Operária)", taxa: 7.00 },
                { nome: "Zona 2 (Bela Vista, Palmas, Hortênsias, Cid. Nova)", taxa: 10.00 },
                { nome: "Zona 3 (Periferia, Estância Serra Negra)", taxa: 15.00 }
            ];
            for (let z of padrao) {
                await addDoc(collection(db, "zonas_frete"), z);
                lista.push(z);
            }
            return lista;
        }
        querySnapshot.forEach((docSnap) => {
            lista.push({ firestoreId: docSnap.id, ...docSnap.data() });
        });
        return lista;
    } catch (e) {
        console.error("Erro ao buscar zonas de frete:", e);
        return [];
    }
};

window.salvarZonaFreteNaNuvem = async function(zona) {
    try {
        await addDoc(collection(db, "zonas_frete"), zona);
        return true;
    } catch (e) {
        console.error("Erro ao salvar zona de frete:", e);
        return false;
    }
};

window.excluirZonaFreteDaNuvem = async function(firestoreId) {
    try {
        await deleteDoc(doc(db, "zonas_frete", firestoreId));
        return true;
    } catch (e) {
        console.error("Erro ao excluir zona de frete:", e);
        return false;
    }
};
// ==========================================
// 9. MÓDULO DE ENCOMENDAS (NUVEM)
// ==========================================
window.obterEncomendasDaNuvem = async function() {
    try {
        const querySnapshot = await getDocs(collection(db, "encomendas"));
        let lista = [];
        querySnapshot.forEach((docSnap) => {
            lista.push({ firestoreId: docSnap.id, ...docSnap.data() });
        });
        return lista;
    } catch (e) {
        console.error("Erro ao buscar encomendas:", e);
        return [];
    }
};

window.salvarEncomendaNaNuvem = async function(encomenda) {
    try {
        await addDoc(collection(db, "encomendas"), encomenda);
        return true;
    } catch (e) {
        console.error("Erro ao salvar encomenda:", e);
        return false;
    }
};

window.excluirEncomendaDaNuvem = async function(firestoreId) {
    try {
        await deleteDoc(doc(db, "encomendas", firestoreId));
        return true;
    } catch (e) {
        console.error("Erro ao excluir encomenda:", e);
        return false;
    }
};
// ==========================================
// Concluir Encomenda e Mover para Relatório (Nuvem)
// ==========================================
window.concluirEncomendaNaNuvem = async function(firestoreId, encomendaData) {
    try {
        // 1. Salva a venda concluída na coleção de vendas
        await addDoc(collection(db, "vendas_encomendas"), {
            ...encomendaData,
            status: 'concluido',
            dataConclusao: new Date().toLocaleString()
        });
        // 2. Remove da lista de encomendas pendentes
        await deleteDoc(doc(db, "encomendas", firestoreId));
        return true;
    } catch (e) {
        console.error("Erro ao concluir encomenda:", e);
        return false;
    }
};

window.mudarAba = function(aba, btn) {
    var botoes = document.querySelectorAll('.tab-btn');
    for(var i=0; i<botoes.length; i++) botoes[i].classList.remove('active');
    var secoes = document.querySelectorAll('.secao-painel');
    for(var j=0; j<secoes.length; j++) secoes[j].style.display = 'none';

    if (aba === 'produtos') { 
        document.getElementById('secao-produtos').style.display = 'block'; 
        window.carregarProdutosAdmin(); 
        window.renderizarOpcoesEncomendaAdmin(); 
    } 
    else if (aba === 'insumos') { 
        document.getElementById('secao-insumos').style.display = 'block'; 
        window.carregarInsumosAdmin(); 
    } 
    else if (aba === 'encomendas') { 
        document.getElementById('secao-encomendas').style.display = 'block'; 
        window.carregarEncomendasAdmin(); 
        window.carregarZonasBalcao(); 
        window.carregarOpcoesSelectBalcao(); 
    } 
    else if (aba === 'clientes') { 
        document.getElementById('secao-clientes').style.display = 'block'; 
        window.carregarClientesAdmin(); 
    } 
    else if (aba === 'funcionarios') { 
        document.getElementById('secao-funcionarios').style.display = 'block'; 
        window.carregarFuncionariosAdmin(); 
    }
    else if (aba === 'pdv') { 
        document.getElementById('secao-pdv').style.display = 'block'; 
        window.carregarPDV(); 
    }
    else if (aba === 'pedidos_online') { 
        document.getElementById('secao-pedidos_online').style.display = 'block'; 
        window.renderizarPedidosDiarios(); 
    }
else if (aba === 'configuracoes') { 
        document.getElementById('secao-configuracoes').style.display = 'block'; 
        if (typeof window.carregarSenhasAdmin === 'function') {
            window.carregarSenhasAdmin();
        } else {
            console.error("A função carregarSenhasAdmin não foi encontrada!");
        }
    }

    if (btn) btn.classList.add('active');
};

        window.toggleCampoPromo = function() {
            var isChecked = document.getElementById('promocao').checked;
            document.getElementById('grupo-preco-promo').style.display = isChecked ? 'block' : 'none';
        };

        window.atualizarAcessoMestre = async function() {
    var novoUsu = document.getElementById('novo-usuario-mestre').value.trim().toLowerCase();
    var novaSenha = document.getElementById('nova-senha-mestre').value.trim();

    if(!novoUsu || !novaSenha) {
        return alert("Preencha o novo usuário e a nova senha!");
    }

    try {
        // Salva os dados no Firebase na coleção "configuracoes", documento "mestre"
        await window.setDoc(window.doc(window.db, "configuracoes", "mestre"), {
            usuario: novoUsu,
            senha: novaSenha
        });
        
        alert("Acesso Mestre atualizado com sucesso! Use os novos dados no próximo login.");
        document.getElementById('novo-usuario-mestre').value = '';
        document.getElementById('nova-senha-mestre').value = '';
    } catch(e) {
        console.error("Erro ao atualizar acesso mestre:", e);
        alert("Erro ao atualizar acesso. Verifique sua conexão.");
    }
};

// Libera as ferramentas do Firestore globalmente para o admin.html
window.db = db;
window.getDocs = getDocs;
window.collection = collection;
window.doc = doc;
window.deleteDoc = deleteDoc;