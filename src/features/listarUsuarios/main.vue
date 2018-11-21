<template lang="html">
  <div>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Pesquisar usuários..."
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
 
      <v-data-table
        :headers="headers"
        :items="usuarios"
        :search="search"
        :pagination.sync="pagination"
        hide-actions
        class="elevation-3"
      >

        <template slot="items" slot-scope="props">
          <td>{{ props.item.nome }}</td>
          <td class="text-xs-left">{{ props.item.setor }}</td>
          <td class="text-xs-left">{{ props.item.email }}</td>
          <td class="text-xs-left">
            <v-icon v-if="props.item.ativo" color="black">check</v-icon>
            <v-icon v-else="props.item.ativo" color="black">clear</v-icon>
          </td>
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
                        v-validate="'required|min:5'"
                        v-model="editedItem.senha"
                        :error-messages="errors.collect('senha')"
                        :type="exibirSenha ? 'text' : 'password'"
                        label="Senha"
                        data-vv-name="senha"
                        required
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs12>
                      <v-select
                        v-validate="'required'"
                        :items="setores"
                        v-model="editedItem.setor"
                        :error-messages="errors.collect('setor')"
                        label="Setor"
                        data-vv-name="setor"
                        required
                      ></v-select>
                    </v-flex>

                    <v-flex xs12>
                      <v-select
                        v-validate="'required'"
                        :items="perguntas"
                        v-model="editedItem.perguntasecreta"
                        :error-messages="errors.collect('perguntasecreta')"
                        label="Pergunta Secreta"
                        data-vv-name="perguntasecreta"
                        required
                      ></v-select>
                    </v-flex>

                    <v-flex xs12>
                      <v-text-field
                        v-validate="'required|min:5'"
                        v-model="editedItem.respostasecreta"
                        :error-messages="errors.collect('respostasecreta')"
                        :type="exibirSenha ? 'text' : 'password'"
                        label="Resposta"
                         data-vv-name="respostasecreta"
                        required
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs12>
                      <v-switch
                        :label="'Ativo'"
                        color="green light"
                        v-model="editedItem.ativo"
                      ></v-switch>
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
      O usuário foi cadastrado com sucesso!
    </v-snackbar>

    <v-snackbar
      v-model="hasEdited"
      :timeout="4000"
      absolute
      bottom
      center
    >
      As alterações do usuário foram salvas!
    </v-snackbar>

    <v-snackbar
      v-model="hasDeleted"
      :timeout="4000"
      absolute
      bottom
      center
    >
      O usuário foi excluido!
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
    exibirSenha: false,
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
        text: "Nome",
        align: "left",
        sortable: false,
        value: "nome"
      },
      //{ text: "Senha", value: "senha", sortable: false},
      { text: "Setor", value: "setor", sortable: false },
      { text: "E-Mail", value: "email", sortable: false },
      { text: "Ativo", value: "ativo", sortable: false },
      { text: "Opções", value: "Opções", sortable: false }
    ],
    usuarios: [],
    editedIndex: -1,
    editedItem: {
      codigo: "",
      nome: "",
      senha: "",
      email: "",
      setor: "Administração",
      perguntasecreta: "Qual é o nome do seu animal de estimação?",
      respostasecreta: "",
      ativo: true
    },
    defaultItem: {
      codigo: "",
      nome: "",
      senha: "",
      email: "",
      setor: "Administração",
      perguntasecreta: "Qual é o nome do seu animal de estimação?",
      respostasecreta: "",
      ativo: true
    },
    dictionary: {
      attributes: {},
      custom: {
        nome: {
          required: () => "Informe o nome do usuário!",
          min: "O nome do usuário deve conter no minimo 4 caracteres!",
          alpha_spaces: "Informe um nome valido!"
        },
        senha: {
          required: () => "Informe a senha do usuário!",
          min: "A senha deve conter no minimo 5 caracteres!"
        },
        email: {
          required: () => "Informe o e-mail do usuário!",
          email: "Informe um e-mail valido! Exemplo: teste@teste.com"
        },
        setor: {
          required: "Selecione o setor do usuário!"
        },
        perguntasecreta: {
          required: "Selecione uma pergunta secreta!"
        },
        respostasecreta: {
          required: () => "Informe a resposta da pergunta secreta!",
          min:
            "A resposta da pergunta secreta deve conter no minimo 5 caracteres!"
        }
      }
    },
    setor: "",
    setores: ["Administração", "Financeiro", "Social"],
    perguntasecreta: "",
    perguntas: [
      "Qual é o nome do seu animal de estimação?",
      "Qual é o nome da sua mãe?",
      "Qual é o nome da sua cidade natal?"
    ]
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Novo Usuário" : "Editar Usuário";
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
        this.editedItem.senha &&
        this.editedItem.email &&
        this.editedItem.respostasecreta
      );
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },

    usuarios() {
      this.$nextTick(() => {
        this.pagination.totalItems = this.usuarios.length;
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
      API.getUsuarios().then(usuarios => (this.usuarios = usuarios));
      /*
      if ((this.usuarios.ativo.text = true)) {
        this.usuarios.ativo = "Ativo";
      } else {
        this.usuarios.ativo = "Inativo";
      }
      */

      this.pagination.totalItems = this.usuarios.length;
      console.log("total items: " + this.pagination.totalItems);
      console.log("lenght: " + this.usuarios.length);
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
      this.editedIndex = this.usuarios.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.usuarios.indexOf(item);
      if (confirm("Você deseja apagar o usuário selecionado?")) {
        console.log("Delete - Usuario");
        axios.delete("/usuario/" + item.codigo).then(response => {
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
          alert("From Submitted!");
          return;
        }
      });
    },

    save() {
      this.$validator.validateAll();

      if (this.editedIndex > -1 && this.$validator.validateAll()) {
        console.log("Edit - Usuario");

        if (this.$validator.validateAll()) {
          axios
            .put("/usuario/" + this.editedItem.codigo, {
              codigo: this.editedItem.codigo,
              nome: this.editedItem.nome,
              senha: this.editedItem.senha,
              email: this.editedItem.email,
              setor: this.editedItem.setor,
              perguntasecreta: this.editedItem.perguntasecreta,
              respostasecreta: this.editedItem.respostasecreta,
              ativo: this.editedItem.ativo
            })
            .then(response => {
              console.log(response);
              console.log(
                "alterar| validador retornou: " + this.$validator.validateAll()
              );
              this.hasEdited = true;
              this.load();
            });
        }

        Object.assign(this.usuarios[this.editedIndex], this.editedItem);
      } else {
        console.log("Create - Usuario");

        if (this.$validator.validateAll()) {
          axios
            .post("/usuario", {
              codigo: this.editedItem.codigo,
              nome: this.editedItem.nome,
              senha: this.editedItem.senha,
              email: this.editedItem.email,
              setor: this.editedItem.setor,
              perguntasecreta: this.editedItem.perguntasecreta,
              respostasecreta: this.editedItem.respostasecreta,
              ativo: this.editedItem.ativo
            })
            .then(response => {
              console.log(response);
              this.hasSaved = true;
              this.load();
            });
        }

        this.usuarios.push(this.editedItem);
      }
      this.close();
      this.load();
    },

    limparCampos() {
      (this.editedItem.perguntasecreta =
        "Qual é o nome do seu animal de estimação?"),
        (this.editedItem.respostasecreta = ""),
        (this.editedItem.codigo = ""),
        (this.editedItem.nome = ""),
        (this.editedItem.senha = ""),
        (this.editedItem.email = ""),
        (this.editedItem.setor = "Administração"),
        (this.editedItem.ativo = false),
        (this.hasSaved = false),
        this.$validator.reset();
    }
    /*
    formatarAtivo() {
      if (this.editedItem.ativo == true){

      }
    }
*/
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
