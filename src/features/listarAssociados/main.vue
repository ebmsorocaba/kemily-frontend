<template lang="html">
   <div>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Pesquisar associados..."
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
 
      <v-data-table
        :headers="headers"
        :items="associados"
        :search="search"
        :pagination.sync="pagination"
        hide-actions
        class="elevation-10"
      >

        <template slot="items" slot-scope="props">
          <td>{{ props.item.cpf }}</td>
          <td class="text-xs-left">{{ props.item.nome }}</td>
          <td class="text-xs-left">{{ props.item.celular }}</td>
          <td class="text-xs-left">{{ props.item.email }}</td>
          <td class="text-xs-left">{{ fixNumber(props.item.valorAtual) }}</td>
          <td class="text-xs-center">{{ formatDate(props.item.vencAtual) }}</td>
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
            <v-form @submit.prevent="validadeBeforeSubmit" novalidate>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>

                    <v-flex xs12>
                      <v-text-field
                        v-validate="'required|alpha_num'"
                        mask="###.###.###-##"
                        v-model="editedItem.cpf"
                        :error-messages="errors.collect('cpf')"
                        label="CPF"
                        data-vv-name="cpf"
                        required
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs12>
                      <v-text-field
                        v-validate="'required|min:4|alpha_spaces'"
                        v-model="editedItem.nome"
                        :error-messages="errors.collect('nome')"
                        label="Nome"
                        data-vv-name="nome"
                        required
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs12>
                      <v-text-field
                        v-validate="'required|numeric'"
                        mask="(##) #####-####" 
                        v-model="editedItem.celular"
                        :error-messages="errors.collect('celular')"
                        label="Celular"
                        data-vv-name="celular"
                        required
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs12>
                      <v-text-field
                        v-validate="'required|email'"
                        v-model="editedItem.email"
                        :error-messages="errors.collect('email')"
                        label="E-Mail"
                        data-vv-name="email"
                        required
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs12>
                      <v-text-field
                        v-validate="'required|decimal'" 
                        v-model="editedItem.valorAtual"
                        :error-messages="errors.collect('valorAtual')"
                        label="Valor"
                        data-vv-name="valorAtual"
                        required
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs12>
                      <v-text-field
                        v-validate="'required|numeric'" 
                        v-model="editedItem.vencAtual"
                        :error-messages="errors.collect('vencAtual')"
                        label="Vencimento"
                        data-vv-name="vencAtual"
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
            </v-form>
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
      O associado foi cadastrado com sucesso!
    </v-snackbar>

    <v-snackbar
      v-model="hasEdited"
      :timeout="4000"
      absolute
      bottom
      center
    >
      As alterações do associado foram salvas!
    </v-snackbar>

    <v-snackbar
      v-model="hasDeleted"
      :timeout="4000"
      absolute
      bottom
      center
    >
      O associado foi excluido!
    </v-snackbar>
  </div>
</template>

<script>
import API from "@/http/API";
import axios from "@/http/http-common";
import moment from "moment";

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
      sortBy: "nome"
    },
    dialog: false,
    headers: [
      {
        text: "CPF",
        align: "left",
        sortable: false,
        value: "cpf"
      },
      { text: "Nome", value: "nome", sortable: false },
      { text: "Celular", value: "celular", sortable: false },
      { text: "E-Mail", value: "email", sortable: false },
      { text: "Valor", value: "valorAtual", sortable: false },
      { text: "Vencimento", value: "vencAtual", sortable: false },
      { text: "Opções", value: "Opções", sortable: false }
    ],
    associados: [],
    editedIndex: -1,
    editedItem: {
      cpf: "",
      nome: "",
      celular: "",
      email: "",
      valorAtual: "",
      vencAtual: ""
    },
    defaultItem: {
      cpf: "",
      nome: "",
      celular: "",
      email: "",
      valorAtual: "",
      vencAtual: ""
    },
    dictionary: {
      attributes: {},
      custom: {
        nome: {
          required: () => "Informe o nome do associado!",
          min: () => "O nome do associado deve conter no minimo 4 caracteres!",
          alpha_spaces: () => "Informe um nome valido!"
        },
        cpf: {
          required: () => "Informe o CPF do associado!",
          alpha_num: () => "Informe um CPF valido!"
        },
        email: {
          required: () => "Informe o e-mail do associado!",
          email: () => "Informe um e-mail valido! Exemplo: teste@teste.com"
        },
        celular: {
          required: () => "Informe o celular do associado!",
          numeric: () => "Informe um numero de telefone valido!"
        },
        valorAtual: {
          required: () => "Informe o valor do pagamento!",
          decimal: () => "Informe um valor valido!"
        },
        vencAtual: {
          required: () => "Selecione o dia do vencimento do pagamento",
          numeric: () => "Informe uma data de vencimento valida!"
        }
      }
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Novo Associado" : "Editar Associado";
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
        this.editedItem.nome &&
        this.editedItem.cpf &&
        this.editedItem.email &&
        this.editedItem.vencAtual &&
        this.editedItem.valorAtual &&
        this.editedItem.celular
      );
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },

    associados() {
      this.$nextTick(() => {
        this.pagination.totalItems = this.associados.length;
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
    formatDate(date) {
      return moment(date).format("DD");
    },

    fixNumber(number) {
      return "R$ " + number.toFixed(2);
    },

    load() {
      API.getAssociados().then(associados => (this.associados = associados));
      this.pagination.totalItems = this.associados.length;
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
      this.editedIndex = this.associados.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.associados.indexOf(item);

      if (confirm("Você realmente deseja excluir este item?")) {
        console.log("Delete - Associado");
        axios.delete("/associado/" + item.cpf).then(response => {
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

    save() {
      if (this.editedIndex > -1) {
        console.log("Edit - Associado");

        axios
          .put("/associado/" + this.editedItem.cpf, {
            cpf: this.editedItem.cpf,
            nome: this.editedItem.nome,
            celular: this.editedItem.celular,
            email: this.editedItem.email,
            valorAtual: this.editedItem.valorAtual,
            vencAtual: this.editedItem.vencAtual
          })
          .then(response => {
            console.log(response);
            this.hasEdited = true;
            this.load();
          });

        Object.assign(this.associados[this.editedIndex], this.editedItem);
      } else {
        console.log("Create - Associado");

        axios
          .post("/associado", {
            cpf: this.editedItem.cpf,
            nome: this.editedItem.nome,
            celular: this.editedItem.celular,
            email: this.editedItem.email,
            valorAtual: this.editedItem.valorAtual,
            vencAtual: this.editedItem.vencAtual
          })
          .then(response => {
            console.log(response);
            this.hasSaved = true;
            this.load();
          });

        this.associados.push(this.editedItem);
      }
      this.load();
      this.close();
    },

    limparCampos() {
      (this.editedItem.cpf = ""),
        (this.editedItem.nome = ""),
        (this.editedItem.celular = ""),
        (this.editedItem.email = ""),
        (this.editedItem.valorAtual = ""),
        (this.editedItem.vencAtual = ""),
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
