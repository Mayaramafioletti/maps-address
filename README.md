# Search Maps


Esta é uma aplicação Angular que permite aos usuários buscar endereços utilizando a API do Google Maps. Quando um endereço válido é inserido, a aplicação exibe o mapa com a localização e outras informações relevantes. Se não ele retorna uma mensagem de erro para o usuário

## Requisitos

Antes de começar, certifique-se de ter o seguinte instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Angular CLI](https://angular.io/cli) (versão mais recente)

## Instalação

Siga os passos abaixo para clonar o repositório e rodar o projeto localmente.

### 1. Clonar o Repositório

Clone o repositório para a sua máquina local usando o comando abaixo:

```
git clone https://github.com/Mayaramafioletti/search-maps.git
```

### 2.  Navegar para o Diretório do Projeto

Entre no diretório do projeto clonado:

```bash
cd address-search-app
```
### 3.  Instalar Dependências

Instale as dependências do projeto usando o comando npm:

```bash
npm install
```
### 4. Rodar a aplicação

Inicie o servidor de desenvolvimento com o comando:

```bash
ng serve
```

A aplicação estará disponível em http://localhost:4200.


## Funcionalidades

Busca de endereços utilizando a API do Google Maps

Exibição do mapa com a localização do endereço buscado

Informações relevantes sobre o endereço (latitude, longitude, endereço formatado)

## Decisões de Design e Organização

### Layout Responsivo
 Utilização do Bootstrap para um layout responsivo e mobile-first.
### Estrutura Modular
Componentes organizados de forma modular para facilitar a manutenção e expansão futura.
### Serviços
GoogleMapsService: Serviço responsável por fazer as requisições à API do Google Maps.
### Inicialização da Aplicação
Utilização de bootstrapApplication no main.ts para inicializar a aplicação de maneira otimizada com componentes standalone.


### Social:
- [Mayara C. Mafioletti - github](https://github.com/Mayaramafioletti/)
- [Mayara C. Mafioletti - linkedin](https://www.linkedin.com/in/mayara-mafioletti/)
