<template lang="html">
   <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Gerenciamento de Usuarios</v-toolbar-title>
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
                  <v-text-field v-model="editedItem.nome" label="Nome"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.senha" label="Senha"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.setor" label="Setor"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.email" label="E-Mail"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.ativo" label="Ativo"></v-text-field>
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
      :items="usuarios"
      :search="search"
      :disable-page-reset="true"
      :pagination.sync="pagination"
      hide-actions
      class="elevation-1"
    >

      <template slot="items" slot-scope="props">
        <td>{{ props.item.nome }}</td>
        <td class="text-xs-right">{{ props.item.senha }}</td>
        <td class="text-xs-right">{{ props.item.setor }}</td>
        <td class="text-xs-right">{{ props.item.email }}</td>
        <td class="text-xs-right">{{ props.item.ativo }}</td>
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
    search: " ",
    pagination: {},
    dialog: false,
    headers: [
      {
        text: "nome",
        align: "left",
        sortable: true,
        value: "nome"
      },
      { text: "Senha", value: "senha", sortable: false },
      { text: "Setor", value: "setor" },
      { text: "E-Mail", value: "email" },
      { text: "Ativo", value: true, sortable: true }
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
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Novo Usuário" : "Editar Usuário";
    },
    pages () {

        this.pagination.rowsPerPage = 10;

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
      API.getUsuarios().then(usuarios => (this.usuarios = usuarios));
      this.pages();
     
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
      confirm("Are you sure you want to delete this item?") &&
        this.usuarios.splice(index, 1);

      console.log("Delete - Usuario");
      axios.delete("/usuario/" + item.nome).then(response => {
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
        console.log("Edit - Usuario");

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

        Object.assign(this.usuarios[this.editedIndex], this.editedItem);
      } else {
        console.log("Create - Usuario");

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

        this.usuarios.push(this.editedItem);
      }
      this.close();
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
