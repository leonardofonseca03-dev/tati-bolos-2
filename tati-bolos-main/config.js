import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, updateDoc, deleteDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// TORNA AS FUNÇÕES DO FIRESTORE GLOBAIS PARA O ADMIN
window.updateDoc = updateDoc;
window.deleteDoc = deleteDoc;
window.doc = doc;
window.setDoc = setDoc;
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
window.carregarProdutosAdmin = async function() {
    let container = document.getElementById('lista-produtos-admin') || document.getElementById('lista-produtos');
    if (!container) return;
    
    container.innerHTML = "<p style='padding: 10px;'>Carregando produtos da nuvem...</p>";
    let produtos = await window.obterProdutosDaNuvem();
    container.innerHTML = "";
    
    if (produtos.length === 0) {
        container.innerHTML = "<p style='padding: 10px; color: #666;'>Nenhum produto cadastrado na nuvem.</p>";
        return;
    }

    produtos.forEach(p => {
        container.innerHTML += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee; background: #fff; margin-bottom: 5px; border-radius: 6px;">
                <div><strong>${p.nome || p.name}</strong> - R$ ${Number(p.preco || p.precoOriginal || 0).toFixed(2)}</div>
                <button onclick="excluirProdutoAdmin('${p.firestoreId}')" style="background: #ff4d4d; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Excluir</button>
            </div>
        `;
    });
};

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
window.carregarClientesAdmin = async function() {
    let container = document.getElementById('lista-clientes-admin') || document.getElementById('lista-clientes');
    if (!container) return;
    
    container.innerHTML = "<p style='padding: 10px;'>Carregando clientes da nuvem...</p>";
    let clientes = await window.obterClientesDaNuvem();
    container.innerHTML = "";
    
    if (clientes.length === 0) {
        container.innerHTML = "<p style='padding: 10px; color: #666;'>Nenhum cliente cadastrado na nuvem.</p>";
        return;
    }

    clientes.forEach(c => {
        container.innerHTML += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee; background: #fff; margin-bottom: 5px; border-radius: 6px;">
                <div><strong>${c.nome || c.name || 'Cliente'}</strong> - ${c.telefone || c.phone || 'Sem telefone'}</div>
                <button onclick="excluirClienteAdmin('${c.firestoreId}')" style="background: #ff4d4d; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Excluir</button>
            </div>
        `;
    });
};

window.excluirClienteAdmin = async function(firestoreId) {
    if (!confirm("Deseja realmente excluir este cliente da nuvem?")) return;
    let sucesso = await window.excluirClienteDaNuvem(firestoreId);
    if (sucesso) {
        alert("Cliente excluído com sucesso!");
        if (typeof window.carregarClientesAdmin === 'function') {
            window.carregarClientesAdmin();
        }
    } else {
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
window.carregarFuncionariosAdmin = async function() {
    let container = document.getElementById('lista-funcionarios-admin') || document.getElementById('lista-funcionarios');
    if (!container) return;
    
    container.innerHTML = "<p style='padding: 10px;'>Carregando funcionários da nuvem...</p>";
    let funcionarios = await window.obterFuncionariosDaNuvem();
    container.innerHTML = "";
    
    if (funcionarios.length === 0) {
        container.innerHTML = "<p style='padding: 10px; color: #666;'>Nenhum funcionário cadastrado na nuvem.</p>";
        return;
    }

    funcionarios.forEach(f => {
        container.innerHTML += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee; background: #fff; margin-bottom: 5px; border-radius: 6px;">
                <div><strong>${f.nome || f.name}</strong> - Cargo: ${f.cargo || f.funcao || 'Geral'}</div>
                <button onclick="excluirFuncionarioAdmin('${f.firestoreId}')" style="background: #ff4d4d; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Excluir</button>
            </div>
        `;
    });
};

window.excluirFuncionarioAdmin = async function(firestoreId) {
    if (!confirm("Deseja realmente excluir este funcionário da nuvem?")) return;
    let sucesso = await window.excluirFuncionarioDaNuvem(firestoreId);
    if (sucesso) {
        alert("Funcionário excluído com sucesso!");
        window.carregarFuncionariosAdmin();
    } else {
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
// Libera as ferramentas do Firestore globalmente para o admin.html
window.db = db;
window.getDocs = getDocs;
window.collection = collection;
window.doc = doc;
window.deleteDoc = deleteDoc;