<template lang="html">
   <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Gerenciamento de Pagamentos</v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <v-btn slot="activator" color="primary" dark class="mb-2">Novo</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.formaPgto.associado.cpf" label="Nome"></v-text-field>
                </v-flex>

<!-- Teste sem nome (bug)
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.formaPgto.associado.nome" label="Nome"></v-text-field>
                </v-flex>
-->
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.valorPago" label="Valor Pago"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.dataPgto" label="Data de Pgto"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.formaPgto.formaPagamento" label="Forma de Pgto"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.vencimento" label="Vencimento"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="close">Cancelar</v-btn>
            <v-btn color="blue darken-1" flat @click.native="save">Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="pagamentos"
      :search="search"
      :pagination.sync="pagination"
      hide-actions
      class="elevation-1"
    >

      <template slot="items" slot-scope="props">
        <td>{{ props.item.id }}</td>
        <td class="text-xs-right">{{ props.item.formaPgto.associado.nome }}</td>
        <td class="text-xs-right">{{ props.item.valorPago }}</td>
        <td class="text-xs-right">{{ props.item.dataPgto }}</td>
        <td class="text-xs-right">{{ props.item.formaPgto.formaPagamento }}</td>
        <td class="text-xs-right">{{ props.item.vencimento }}</td>
        <td class="justify-center layout px-0">
          <v-icon
            small
            class="mr-2"
            @click="editItem(props.item)"
          >
            edit
          </v-icon>
          <v-icon
            small
            @click="deleteItem(props.item)"
          >
            delete
          </v-icon>
        </td>
      </template>
      <template slot="no-data">
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
    <div class="text-xs-center pt-2">
      <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
  </div>

  
     <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>

</div>
  
</template>

<script>
import API from "@/lib/API";
import axios from "../http-common";

export default {
  data: () => ({
    search: "",
    pagination: {rowsPerPage:5, totalItems:6},
    dialog: false,
    headers: [
      {
        text: "ID",
        align: "left",
        sortable: true,
        value: "id"
      },
      { text: "Nome", value: "formaPgto.associado.nome" },
      { text: "Valor Pago", value: "valorPago" },
      { text: "Data de Pgto", value: "dataPgto" },
      { text: "Forma de Pgto", value: "formaPgto." },
      { text: "Vencimento", value: "vencimento", sortable: false }
    ],
    pagamentos: [],
    editedIndex: -1,
    editedItem: {
      valorPago: "99",
      dataPgto: "2018-08-08",
      formaPgto: {
        associado: {
          cpf: "444.444.444-44"
        },
        formaPagamento: "Dinheiro",
      },
      
      vencimento: "2019-10-10"
    },
    defaultItem: { 
      valorPago: "99",
      dataPgto: "2018-08-08",
      formaPgto: {
        associado: {
          cpf: "444.444.444-44"
        },
        formaPagamento: "Dinheiro",
      },
      
      vencimento: "2019-10-10"
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Novo Pagamento" : "Editar Pagamento";
    },
    pages () {
        if (this.pagination.rowsPerPage == null ||
          this.pagination.totalItems == null
        ) return 0

        return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
      },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    load() {
      API.getPagamentos().then(pagamentos => (this.pagamentos = pagamentos));
      this.pages();
    },

    initialize() {
      this.load();
    },

    editItem(item) {
      this.editedIndex = this.pagamentos.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.pagamentos.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.pagamentos.splice(index, 1);

      console.log("Delete - Pagamento");
      axios.delete("/pagamento/" + item.id).then(response => {
        console.log(response);
      });
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    
    save() {
      if (this.editedIndex > -1) {
        
        console.log("Edit - Pagamento");

        axios
          .put("/pagamento/" + this.editedItem.id, {
            id: this.editedItem.id,
            valorPago: this.editedItem.valorPago,
            vencimento: this.editedItem.vencimento,
            dataPgto: this.editedItem.dataPgto,
            formaPgto: this.editedItem.formaPgto    
                   
          })
          .then(response => {
              console.log(response);
          });
        
        Object.assign(this.pagamentos[this.editedIndex], this.editedItem);
        
        
      } else {
        console.log("Create - Pagamento");
        console.log(this.editedItem.formaPgto.formaPagamento);
        axios
          .post("/pagamento", {
            valorPago: this.editedItem.valorPago,
            vencimento: this.editedItem.vencimento,
            dataPgto: this.editedItem.dataPgto,
            formaPgto: {
                associado: {
                    cpf: this.editedItem.formaPgto.associado.cpf
                },
                formaPagamento: this.editedItem.formaPgto.formaPagamento,
                atual: "true"
            }         
          })
          .then(response => {
            console.log(response);
          });
        console.log(this.editedItem.formaPgto.associado.cpf);
        this.pagamentos.push(this.editedItem);
      }
      this.close();
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
