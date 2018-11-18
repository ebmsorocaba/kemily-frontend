<template lang="html">
   <div>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Pesquisar ..."
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
 
      <v-data-table
        :headers="headers"
        :items="pagamentos"
        :search="search"
        :pagination.sync="pagination"
        hide-actions
        class="elevation-3"
      >

        <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.dataPgto }}</td>
        <td class="text-xs-left">{{ props.item.formaPgto.associado.cpf }}</td>
        <td class="text-xs-left">{{ props.item.formaPgto.associado.nome }}</td>
        <td class="text-xs-left">{{ props.item.valorPago }}</td>
        <td class="text-xs-left">{{ props.item.formaPgto.formaPagamento }}</td>
        <td class="text-xs-left">{{ props.item.vencimento }}</td>
        <td class="justify-left">
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
          <v-alert :value="true" color="grey" icon="warning">
              Não foi possível efetuar a comunicação com o servidor.
              <v-btn color="white" @click="initialize">Atualizar</v-btn>
          </v-alert>
        </template>

        <v-alert slot="no-results" :value="true" color="grey" icon="warning">
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
          ><v-icon dark>person_add</v-icon></v-btn>

          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <!--Inicio do form de cadastros/alteracoes -->
            <form @submit.prevent="validadeBeforeSubmit" novalidate>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
               
                <v-flex xs12>
                  <v-autocomplete
                    v-validate="'required|alpha_num'"
                    v-model="editedItem.formaPgto.associado.cpf"
                    :error-messages="errors.collect('cpf')"
                    label="CPF"
                    :items="editedItem"
                    :filter="customFilter"
                    data-vv-name="cpf"
                    item-text="cpf"
                    required
                  ></v-autocomplete>
                </v-flex>

                <v-flex xs12>
                  <v-text-field 
                    v-validate="'required'"
                    v-model="editedItem.formaPgto.associado.nome"
                    :error-messages="errors.collect('nome')"
                    label="Nome"
                    data-vv-name="nome"
                    required
                  ></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <v-text-field
                    v-validate="'required|decimal'"
                    v-model="editedItem.valorPago"
                    :error-messages="errors.collect('valorPago')"
                    label="Valor Pago"
                    data-vv-name="valorPago"
                    required
                  ></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <v-text-field
                    v-validate="'required|date_format:DD/MM/YYYY'"
                    v-model="editedItem.dataPgto"
                    :error-messages="errors.collect('dataPgto')"
                    label="Data de Pgto"
                    data-vv-name="dataPgto"
                    required
                  ></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <v-select
                    v-validate="'required'"
                    :items="formasPgto"
                    v-model="editedItem.formaPgto.formaPagamento"
                    :error-messages="errors.collect('formaPagamento')"
                    label="Forma de Pgto"
                    data-vv-name="formaPagamento"
                    required
                  ></v-select>
                </v-flex>

                <v-flex xs12>
                  <v-text-field
                    v-validate="'required|date_format:DD/MM/YYYY'"
                    v-model="editedItem.vencimento"
                    :error-messages="errors.collect('vencimento')"
                    label="Vencimento"
                    data-vv-name="vencimento"
                    required
                  ></v-text-field>
                </v-flex>
                  
                  </v-layout>
                </v-container>
              </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn id="salvar" color="grey lighten-1" @click.native="save" :disabled="errors.any() || !isCompleted">Salvar</v-btn>
              <v-btn color="grey lighten-1" @click.native="close">Cancelar</v-btn>
            </v-card-actions>
            </form>
          </v-card>
        </v-dialog>

  </v-card>
  </div>
</template>

<script>
import API from "@/http/API";
import axios from "@/http/http-common";

export default {
  $_veeValidate: {
    validator: "new"
  },

  data: () => ({
    search: "",
    pagination: {
      rowsPerPage: 10,
      totalItems: 0,
      sortBy: "dataPgto"
    },
    dialog: false,
    headers: [
      { text: "Data de Pgto", value: "dataPgto", sortable: false },
      {
        text: "CPF",
        align: "left",
        sortable: false,
        value: "props.item.formaPgto.associado.cpf"
      },

      {
        text: "Nome",
        value: "formaPgto.item.formaPgto.associado.nome",
        sortable: false
      },
      { text: "Valor Pago", value: "valorPago", sortable: false },
      { text: "Forma de Pgto", value: "formaPgto.", sortable: false },
      { text: "Vencimento", value: "vencimento", sortable: false },
      { text: "Opções", value: "Opções", sortable: false }
    ],
    pagamentos: [],
    editedIndex: -1,
    editedItem: {
      formaPgto: {
        associado: {
          cpf: "",
          nome: "",
          celular: "",
          email: "",
          valorAtual: "",
          vencAtual: ""
        },
        formaPagamento: ""
      },
      valorPago: "",
      dataPgto: ""
    },
    defaultItem: {
      formaPgto: {
        associado: {
          cpf: "",
          nome: "",
          celular: "",
          email: "",
          valorAtual: "",
          vencAtual: ""
        },
        formaPagamento: ""
      },
      valorPago: "",
      dataPgto: ""
    },
    formasPgto: ["Dinheiro", "Cartão", "Boleto"]
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
    },
    isCompleted() {
      return (
        this.editedItem.valorPago &&
        this.editedItem.dataPgto &&
        this.editedItem.formaPgto.associado.cpf &&
        this.editedItem.formaPgto.associado.nome &&
        this.editedItem.vencimento
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

  mounted() {
    this.$validator.localize("pt", this.dictionary);
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
        this.load();
      });
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    validateBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          alert("From Submitted!");
          return;
        }
      });
    },

    customFilter(item, queryText, itemText) {
      const textOne = item.formaPgto.associado.nome.toLowerCase();
      const searchText = queryText.toLowerCase();
      return (
        textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
      );
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
      this.load();
      this.close();
    },

    limparCampos() {
      (this.editedItem.cpf_associado = ""),
        // (this.editedItem.formaPgto.associado.nome = ""),
        (this.editedItem.valorPago = ""),
        (this.editedItem.vencimento = ""),
        (this.editedItem.id = ""),
        (this.editedItem.formaPgto = "Dinheiro"),
        (this.editedItem.dataPgto = ""),
        this.$validator.reset();
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
