<template lang="html">
   <div>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Pesquisar associados..."
          single-line
          background-color="green lighten-4"
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
          <td class="text-xs-left">{{ props.item.valorAtual }}</td>
          <td class="text-xs-left">{{ props.item.vencAtual }}</td>
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
                      <v-text-field v-model="editedItem.cpf" label="CPF" required></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field v-model="editedItem.nome" label="Nome" required></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field v-model="editedItem.celular" label="Celular" required></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field v-model="editedItem.email" label="E-Mail" required></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field v-model="editedItem.valorAtual" label="Valor" required></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field v-model="editedItem.vencAtual" label="Vencimento" required></v-text-field>
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
      nome: "",
      celular: "",
      email: "",
      valorAtual: 0,
      vencAtual: 0
    },
    defaultItem: {
      nome: "",
      celular: "",
      email: "",
      valorAtual: 0,
      vencAtual: 0
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

  methods: {
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
      confirm("Você realmente deseja excluir este item?") &&
        this.associados.splice(index, 1);

      console.log("Delete - Associado");
      axios.delete("/associado/" + item.cpf).then(response => {
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
          });

        this.associados.push(this.editedItem);
      }
      this.close();
    },
    limparCampos() {
      (this.editedItem.cpf = ""),
        (this.editedItem.nome = ""),
        (this.editedItem.celular = ""),
        (this.editedItem.email = ""),
        (this.editedItem.valorAtual = ""),
        (this.editedItem.vencAtual = "");
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
