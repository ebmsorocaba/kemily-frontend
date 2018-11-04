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

      <v-divider
          class="mx-2"
          inset
          vertical
        ></v-divider>
      
      <v-data-table
        :headers="headers"
        :items="usuarios"
        :search="search"
        :pagination.sync="pagination"
        hide-actions
        class="elevation-10"
      >

        <template slot="items" slot-scope="props">
          <td>{{ props.item.nome }}</td>
          <td class="text-xs-left">{{ props.item.setor }}</td>
          <td class="text-xs-left">{{ props.item.email }}</td>
          <td class="text-xs-left">{{ props.item.ativo }}</td>
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
    <v-spacer></v-spacer>

    <v-toolbar>
        <v-dialog v-model="dialog" max-width="500px">
          <v-btn slot="activator" id="_add"
                  @click.native="limparCampos"
                  fab
                  dark
                  medium
                  right
                  absolute
                  color="green lighten"
          ><v-icon dark>person_add</v-icon></v-btn>

          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12>
                      <v-text-field v-model="editedItem.nome" label="Nome" :rules="nomeRules" required></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field id="passField" v-model="editedItem.senha" label="Senha" :rules="[rules.required]" :type="exibirSenha ? 'text' : 'password'" required></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-select :items="setores" v-model="editedItem.setor" label="Setor"  :rules="setorRules" required></v-select>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field v-model="editedItem.email" label="E-Mail" :rules="emailRules" required></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-switch :label="'Ativo'" color="green light" v-model="editedItem.ativo" :rules="ativoRules"></v-switch>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn id="salvar" color="blue lighten" @click.native="save" :disabled="!valid">Adicionar Usuário</v-btn>
              <v-btn color="yellow lighten-3" @click.native="limparCampos">Limpar</v-btn>
              <v-btn color="red darken-3" @click.native="close">Cancelar</v-btn>
            </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
      </v-toolbar>

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
    exibirSenha: false,
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
        value: "Nome"
      },
      //{ text: "Senha", value: "senha", sortable: false},
      { text: "Setor", value: "Setor", sortable: false },
      { text: "E-Mail", value: "E-Mail", sortable: false },
      { text: "Ativo", value: true, sortable: false },
      { text: "Opções", value: "Opções", sortable: false }
    ],
    usuarios: [],
    editedIndex: -1,
    editedItem: {
      nome: "",
      senha: "",
      email: "",
      setor: "",
      ativo: true
    },
    defaultItem: {
      nome: "",
      senha: "",
      email: "",
      setor: "",
      ativo: true
    },
    rules: {
      required: value => !!value || "Informe a Senha!"
    },
    nomeRules: [
      v => !!v || "Informe o nome!"
    ],
    email: "",
    emailRules: [
      v => !!v || "Informe o e-mail!",
      v => /.+@.+../.test(v) || "O E-mail deve ser valido!"
    ],
    senha: "",
    senhaRules: [
      v => !!v || "Informe a senha!",
      v =>
        (v && v.length <= 100) ||
        "A senha não deve ultrapassar o limite de caracteres"
    ],
    setor: "",
    setorRules: [
      v => !!v || "Informe o setor!",
      v =>
        (v && v.length <= 20) ||
        "O setor não deve ultrapassar o limite de caracteres"
    ],
    ativo: "",
    ativoRules: [
      v => !!v || "Usuário Inativo!"
    ],
    setores: ["Administração", "Financeiro", "Social"]
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
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },

    usuarios() {
      this.$nextTick(() => {
        this.pagination.totalItems = this.usuarios.length
      })
    }
  },

  created() {
    this.initialize();

  },

  methods: {
    load() {
      API.getUsuarios().then(usuarios => (this.usuarios = usuarios));
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
      confirm("Você deseja apagar o usuário selecionado?") &&
        this.usuarios.splice(index, 1);

      console.log("Delete - Usuario");
      axios.delete("/usuario/" + item.nome).then(response => {
        console.log(response);
        //this.pagination.hotUpdate;
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
      //this.limparCampos();
      //console.log(valid);
      if (this.editedIndex > -1) {
        console.log("Edit - Usuario");

        if (this.$refs.form.validate()) {
          axios
            .put("/usuario/" + this.editedItem.nome, {
              nome: this.editedItem.nome,
              senha: this.editedItem.senha,
              email: this.editedItem.email,
              setor: this.editedItem.setor,
              ativo: this.editedItem.ativo
            })
            .then(response => {
              console.log(response);
            });
        }

        Object.assign(this.usuarios[this.editedIndex], this.editedItem);
      } else {
        console.log("Create - Usuario");

        if (this.$refs.form.validate()) {
          axios
            .post("/usuario", {
              nome: this.editedItem.nome,
              senha: this.editedItem.senha,
              email: this.editedItem.email,
              setor: this.editedItem.setor,
              ativo: this.editedItem.ativo
            })
            .then(response => {
              console.log(response);
            });
        }

        this.usuarios.push(this.editedItem);
      }
      this.close();
    },

    limparCampos() {
      (this.editedItem.nome = ""),
      (this.editedItem.senha = ""),
      (this.editedItem.email = ""),
      (this.editedItem.setor = ""),
      (this.editedItem.ativo = "");
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
  bottom: -5px;
  right: 10px;
}
</style>
