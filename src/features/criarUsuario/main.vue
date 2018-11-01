<template>
<v-layout (justify-center align-center)>
    <v-flex xs12>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-text-field
      v-model="nome"
      :rules="nomeRules"
      :counter="100"
      label="Nome"
      required
    ></v-text-field>
    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="E-mail"
      required
    ></v-text-field>
    
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
   
     <v-text-field
      v-model="setor"
      :rules="setorRules"
      :counter="20"
      label="Setor"
      required
    ></v-text-field>
   <v-checkbox
      v-model="ativo"
      label="Ativo"
    ></v-checkbox>

    <v-btn
      :disabled="!valid"
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
import API from "@/http/API";
import axios from "@/http/http-common";

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
      email: '',
      emailRules: [
        v => !!v || 'Informe o e-mail!',
        v => /.+@.+../.test(v) || 'O E-mail deve ser valido!'
      ],
      senha: '',
      senhaRules: [
        v => !!v || 'Informe a senha!',
        v => (v && v.length <= 100) || 'A senha não deve ultrapassar o limite de caracteres'
      ],
      setor: '',
      setorRules: [
        v => !!v || 'Informe o setor!',
        v => (v && v.length <= 20) || 'O setor não deve ultrapassar o limite de caracteres'
      ],      
      checkbox: true
    }),

    methods: {
      submit () {
        console.log("Create - Usuario");
         confirm("Confirmar");

        if (this.$refs.form.validate()) {
          // Native form submission is not yet supported
          axios.post("/usuario", {
            nome: this.nome,
            senha: this.senha,
            email: this.email,
            setor: this.setor,
            ativo: this.checkbox
          })
          .then(response => {
            console.log(response);
          });
        }
      },
      clear () {
        this.$refs.form.reset()
      }
    }
  }
</script>