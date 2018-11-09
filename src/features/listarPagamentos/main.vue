<template lang="html">
   <div>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Pesquisar ..."
          single-line
          background-color="green lighten-4"
          hide-details
        ></v-text-field>
      </v-card-title>
 
      <v-data-table
        :headers="headers"
        :items="pagamentos"
        :search="search"
        :pagination.sync="pagination"
        hide-actions
        class="elevation-10"
      >

        <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.formaPgto.associado.cpf }}</td>
        <td class="text-xs-left">{{ props.item.formaPgto.associado.nome }}</td>
        <td class="text-xs-left">{{ props.item.valorPago }}</td>
        <td class="text-xs-left">{{ props.item.dataPgto }}</td>
        <td class="text-xs-left">{{ props.item.formaPgto.formaPagamento }}</td>
        <td class="text-xs-left">{{ props.item.vencimento }}</td>
        <td class="justify-left">
            <v-icon
              small
              color="blue"
              class="mr-2"
              @click="editItem(props.item)"
            >
              edit
            </v-icon>
            <v-icon
              small
              color="red"
              @click="deleteItem(props.item)"
            >
              delete
            </v-icon>
          </td>
        </template>

        <template slot="no-data">
          <v-alert :value="true" color="error" icon="warning">
              Não foi possível efetuar a comunicação com o servidor.
              <v-btn color="white" @click="initialize">Atualizar</v-btn>
          </v-alert>
        </template>

        <v-alert slot="no-results" :value="true" color="error" icon="warning">
              Não foram encontradas referencias de "{{ search }}" durante a pesquisa!
        </v-alert>
      </v-data-table>

      <div class="text-xs-center pt-5">
        <v-pagination v-model="pagination.page" :length="pages" color="blue"></v-pagination>
    </div>

    
        <v-dialog v-model="dialog" max-width="500px">
          <v-btn slot="activator" id="_add"
                  @click.native="limparCampos"
                  fab
                  dark
                  large
                  right
                  absolute
                  color="green lighten"
          ><v-icon dark>add</v-icon></v-btn>

          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
               
                <v-flex xs12>
                  <v-text-field v-model="editedItem.formaPgto.associado.cpf" label="CPF"></v-text-field>
                </v-flex>
                <!--
                <v-flex xs12>
                  <v-text-field v-model="editedItem.formaPgto.associado.nome" label="Nome"></v-text-field>
                </v-flex>
                -->
                <v-flex xs12>
                  <v-text-field v-model="editedItem.valorPago" label="Valor Pago"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="editedItem.dataPgto" label="Data de Pgto"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-select :items="formaspagto" v-model="editedItem.formaPgto.formaPagamento" label="Forma de Pgto" required></v-select>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="editedItem.vencimento" label="Vencimento"></v-text-field>
                </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn id="salvar" color="blue lighten" @click.native="save" :disabled="!valid">Salvar</v-btn>
              <v-btn color="yellow lighten-3" @click.native="limparCampos">Limpar</v-btn>
              <v-btn color="red darken-3" @click.native="close">Cancelar</v-btn>
            </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>

  </v-card>
  </div>
</template>

<script>
import API from "@/http/API";
import axios from "@/http/http-common";

export default {
  data: () => ({
    search: "",
    valid: true,
    pagination: {
      rowsPerPage: 8,
      totalItems: 0,
      sortBy: "nome"
    },
    dialog: false,
    headers: [
      { text: "CPF", value: "formaPgto.associado.cpf", sortable: false },
      { text: "Nome", value: "formaPgto.associado.nome", sortable: false },
      { text: "Valor Pago", value: "valorPago", sortable: false },
      { text: "Data de Pgto", value: "dataPgto", sortable: false },
      { text: "Forma de Pgto", value: "formaPgto.", sortable: false },
      { text: "Vencimento", value: "vencimento", sortable: false },
      { text: "Opções", value: "Opções", sortable: false }
    ],
    pagamentos: [],
    editedIndex: -1,
    editedItem: {
      valorPago: "",
      dataPgto: "",
      formaPgto: {
        associado: {
          cpf: ""
        },
        formaPagamento: "Dinheiro"
      },

      vencimento: ""
    },
    defaultItem: {
      valorPago: "",
      dataPgto: "",
      formaPgto: {
        associado: {
          cpf: ""
        },
        formaPagamento: "Dinheiro"
      },

      vencimento: ""
    },
    formaspagto: ["Boleto", "Cartão", "Dinheiro"]
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Novo Pagamento" : "Editar Pagamento";
    },
    pages() {
      if (
        this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      )
        return 0;

      return Math.ceil(
        this.pagination.totalItems / this.pagination.rowsPerPage
      );
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },

    pagamentos() {
      this.$nextTick(() => {
        this.pagination.totalItems = this.pagamentos.length;
      });
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    load() {
      API.getPagamentos().then(pagamentos => (this.pagamentos = pagamentos));
      this.pagination.totalItems = this.pagamentos.length;
    },

    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
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
      confirm("Você realmente deseja excluir este item?") &&
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

    limparCampos() {
      // (this.editedItem.formaPgto.associado.cpf = ""),
      // (this.editedItem.formaPgto.associado.nome = ""),
      //(this.editedItem.valorPago = ""),
      // (this.editedItem.vencimento = ""),
      // (this.editedItem.id = ""),
      // (this.editedItem.formaPgto = ""),
      //(this.editedItem.dataPgto = "");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#_pesquisar {
  align-self: center;
}

#_add {
  position: fixed;
  bottom: 15px;
  right: 15px;
}
</style>
