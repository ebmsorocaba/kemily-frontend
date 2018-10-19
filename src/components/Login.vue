<template>
<v-layout>
    <v-flex xs8>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-text-field
      v-model="nome"
      :rules="nomeRules"
      :counter="100"
      label="Nome"
      required
    ></v-text-field>
    <!--
    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="E-mail"
      required
    ></v-text-field>


    _____________

          email: '',
      emailRules: [
        v => !!v || 'Informe o e-mail!',
        v => /.+@.+../.test(v) || 'O E-mail deve ser valido!'
      ],
      
     -->
    <v-text-field
      v-model="senha"
      :append-icon="show1 ? 'visibility_off' : 'visibility'"
      :rules="[rules.required]"
      :type="show1 ? 'text' : 'password'"
      name="senha"
      label="Senha"
      counter
      @click:append="show1 = !show1"
    ></v-text-field>

    <v-btn
      @click="submit"
    >
      Confirmar
    </v-btn>
    <v-btn @click="clear">Limpar</v-btn>
  </v-form>
    </v-flex>
</v-layout>
</template>

<script>
  import API from "@/lib/API";
  import axios from "../http-common";

  export default {
    data: () => ({
      valid: true,
      nome: '',
      show1: false,
      rules: {
        required: value => !!value || 'Informe a Senha!',
      },
      nomeRules: [
        v => !!v || 'Informe o nome!',
        v => (v && v.length <= 100) || 'O nome não deve ultrapassar o limite de caracteres'
      ],
      senha: '',
      senhaRules: [
        v => !!v || 'Informe a senha!',
        v => (v && v.length <= 100) || 'A senha não deve ultrapassar o limite de caracteres'
      ]

    }),

    methods: {
      submit () {
        console.log("Create - Usuario");
         confirm("Confirmar");

        if (this.$refs.form.validate()) {
          // Native form submission is not yet supported
          
          
          axios.get("/usuario/" + this.nome 
          + "?senha=" + this.senha)
          
          .then(function(response) {
            if(response.status == 200){
              window.location = '/'
            }
            else{
              alert("Usuário ou senha incorreto")
            }
         console.log(response.data);
      }).catch(function(error) {
         console.log(error.response.data);

      });
        }
      },
      clear () {
        this.$refs.form.reset()
      }
    }
  }
</script>