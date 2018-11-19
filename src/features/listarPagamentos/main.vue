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
        ref="table"
        :headers="headers"
        :items="pagamentos"
        :search="search"
        :pagination.sync="pagination"
        hide-actions
        class="elevation-3"
      >

        <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.dataPgto }}</td>
        <td class="text-xs-left">{{ props.item.associado.cpf }}</td>
        <td class="text-xs-left">{{ props.item.associado.nome }}</td>
        <td class="text-xs-left">{{ props.item.valorPago }}</td>
        <td class="text-xs-left">{{ props.item.formapgto }}</td>
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
          ><v-icon dark>add</v-icon></v-btn>

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
                  <v-text-field 
                    v-validate="'required|alpha_num'"
                    mask="###.###.###-##"
                    v-model="editedItem.associado.cpf"
                    :error-messages="errors.collect('cpf')"
                    label="CPF"
                    data-vv-name="cpf"
                    required
                  ></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <v-text-field 
                    v-model="editedItem.associado.nome"
                    label="Nome"
                    solo
                    disabled
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
                    type="date"
                    dont-fill-mask-blanks
                    v-validate="'required'"
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
                    v-model="editedItem.formapgto"
                    :error-messages="errors.collect('formapgto')"
                    label="Forma de Pgto"
                    data-vv-name="formapgto"
                    required
                  ></v-select>
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

  <v-snackbar
      v-model="hasSaved"
      :timeout="4000"
      absolute
      bottom
      center
    >
      O pagamento foi cadastrado com sucesso!
    </v-snackbar>

    <v-snackbar
      v-model="hasEdited"
      :timeout="4000"
      absolute
      bottom
      center
    >
      As alterações do pagamento foram salvas!
    </v-snackbar>

    <v-snackbar
      v-model="hasDeleted"
      :timeout="4000"
      absolute
      bottom
      center
    >
      O pagamentos foi excluido!
    </v-snackbar>

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
    hasSaved: false,
    hasEdited: false,
    hasDeleted: false,
    pagination: {
      rowsPerPage: 10,
      totalItems: 0,
      sortBy: "dataPgto"
    },
    dialog: false,
    headers: [
      {
        text: "Data de Pgto",
        value: "dataPgto",
        sortable: false
      },
      {
        text: "CPF",
        align: "left",
        sortable: false,
        value: "props.item.formaPgto.associado.cpf"
      },

      {
        text: "Nome",
        align: "left",
        value: "formaPgto.item.formaPgto.associado.nome",
        sortable: false
      },
      { text: "Valor Pago", value: "valorPago", sortable: false },
      { text: "Forma de Pgto", value: "formapgto", sortable: false },
      { text: "Opções", value: "Opções", sortable: false }
    ],
    pagamentos: [],
    editedIndex: -1,
    editedItem: {
      id: "",
      valorPago: "",
      dataPgto: "",
      formapgto: "",
      associado: {
        cpf: "",
        nome: ""
      }
    },
    defaultItem: {
      id: "",
      valorPago: "",
      dataPgto: "",
      formapgto: "",
      associado: {
        cpf: "",
        nome: ""
      }
    },
    dictionary: {
      attributes: {},
      custom: {
        cpf: {
          required: () => "Informe o cpf do Associado!",
          alpha_num: "Informe um CPF valido!"
        },
        nome: {
          required: () => "O Associado não foi encontrado!",
          alpha_spaces: "Nome invalido!"
        },
        valorPago: {
          required: () => "Informe o valor do pagamento!",
          decimal: () => "Informe um valor valido!"
        },
        dataPgto: {
          required: () => "Informe a data do Pagamento!",
          date_format: () => "A data deve estar no formato DD/MM/YYYY!"
        },
        formapgto: {
          required: () => "Selecione a forma do Pagamento!"
        }
      }
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
        // this.editedItem.dataPgto &&
        this.editedItem.associado.cpf
        // this.editedItem.formaPgto.associado.nome &&
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

      if (confirm("Você realmente deseja excluir este item?")) {
        console.log("Delete - Pagamento");
        axios.delete("/pagamento/" + item.id).then(response => {
          console.log(response);
          this.load();
          this.hasDeleted = true;
        });
      }
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
          // alert("Form Submitted!");
          return;
        }
      });
    },

    customFilter(item, queryText, itemText) {
      const textOne = item.associado.cpf.toLowerCase();
      const searchText = queryText.toLowerCase();
      return textOne.indexOf(searchText) > -1;
    },

    save() {
      if (this.editedIndex > -1) {
        console.log("Edit - Pagamento");

        axios
          .put("/pagamento/" + this.editedItem.id, {
            id: this.editedItem.id,
            valorPago: this.editedItem.valorPago,
            dataPgto: this.editedItem.dataPgto,
            formapgto: this.editedItem.formapgto,
            cpfassociado: this.editedItem.associado.cpf
          })
          .then(response => {
            console.log(response);
            this.hasEdited = true;
            this.load();
          });

        Object.assign(this.pagamentos[this.editedIndex], this.editedItem);
      } else {
        console.log("Create - Pagamento");
        axios
          .post("/pagamento", {
            valorPago: this.editedItem.valorPago,
            dataPgto: this.editedItem.dataPgto,
            formapgto: this.editedItem.formapgto,
            cpfassociado: this.editedItem.associado.cpf
          })
          .then(response => {
            console.log(response);
            this.hasSaved = true;
            this.load();
          });

        this.pagamentos.push(this.editedItem);
      }
      this.load();
      this.close();
    },

    limparCampos() {
      (this.editedItem.associado.cpf = ""),
        (this.editedItem.associado.nome = ""),
        (this.editedItem.valorPago = ""),
        (this.editedItem.id = ""),
        (this.editedItem.formapgto = "Dinheiro"),
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
