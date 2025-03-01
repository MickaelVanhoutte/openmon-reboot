<script lang="ts">
    import type { FullDexEntry } from "$lib/pokedex/fulldex";
    import { Card, Chart } from "flowbite-svelte";
    import { onMount } from "svelte";
    //import ApexCharts from "apexcharts";
    import { typeChart } from "$lib/pokedex/fulldex";
    import type { ApexOptions } from "apexcharts";

    let pokedex: FullDexEntry[] = [];
    

    let pokemonCount: number = 0;
    let moveCount: number = 0;
    let abilityCount: number = 0;
    let typeRepartitions: {type: string, count: number}[] = [];
    let statsRepartitions = {};
    let movesRepartitions = {};

    let typeChartOpt: ApexOptions;

    function startAnalysis(){
        const moves = new Set();
        const abilities = new Set();
        pokedex.forEach((pokemon) => {
            pokemon.moves.forEach((move) => {
                moves.add(move.name);
            });
            pokemon.profile.ability.forEach((ability) => {
                abilities.add(ability[0]);
            });
            pokemon.type.forEach((type) => {
                const index = typeRepartitions.findIndex((entry) => entry.type === type);
                if(index !== -1){
                    typeRepartitions[index].count++;
                }else{
                    typeRepartitions.push({type, count: 1});
                }
            });
        });
        pokemonCount = pokedex.length;
        moveCount = moves.size;
        abilityCount = abilities.size;

        typeChartOpt = {
                series: typeRepartitions.map((entry) => entry.count),
                labels: typeRepartitions.map((entry) => entry.type),
                colors: typeRepartitions.map((entry) => typeChart[entry.type?.toLocaleLowerCase()].color),
                chart: {
                    height: 420,
                    width: "100%",
                    type: "pie",
                },
                stroke: {
                    colors: ["white"],
                    lineCap: "",
                },
                plotOptions: {
                    pie: {
                        labels: {
                        show: true,
                        },
                        size: "100%",
                        dataLabels: {
                        offset: -25
                        }
                    },
                },
                dataLabels: {
                    enabled: true,
                },
                legend: {
                    labels: {
                        colors: "white",
                    }
                },
                axisTicks: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },

            };
    }



    onMount(() => {
        fetch("final/pokedex.json")
             .then((response) => response.json())
             .then((data) => {
                 pokedex = data;
                 startAnalysis();
             });
    });
</script>

<Card class="max-w-full sm:max-w-auto">
    <dl class="grid max-w-screen-xl grid-cols-1 gap-8 p-4 mx-auto text-gray-900 sm:grid-cols-2 xl:grid-cols-3 dark:text-white sm:p-8">
        <div class="flex flex-col items-center justify-center">
            <dt class="mb-2 text-3xl font-extrabold">{pokemonCount}</dt>
            <dd class="text-gray-500 dark:text-gray-400">Pokemons</dd>
        </div>
        <div class="flex flex-col items-center justify-center">
            <dt class="mb-2 text-3xl font-extrabold">{moveCount}</dt>
            <dd class="text-gray-500 dark:text-gray-400">Moves</dd>
        </div>
        <div class="flex flex-col items-center justify-center">
            <dt class="mb-2 text-3xl font-extrabold">{abilityCount}</dt>
            <dd class="text-gray-500 dark:text-gray-400">Abilities</dd>
        </div>
    </dl>
</Card>



<div class="w-full bg-white rounded-lg shadow-sm dark:bg-gray-800 p-4 md:p-6">

    <div class="flex justify-between items-start w-full">
        <div class="flex-col items-center">
          <div class="flex items-center mb-1">
              <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white me-1">Types repartition</h5>
        </div>
      </div>
    </div>
  
{#if typeChartOpt}
<Chart options={typeChartOpt}/>
{/if}
</div>

 
  


todo:  <br>
load current pokedex file <br>
display nb of pokemon <br>
display nb of moves <br>
display nb of abilities <br>
display type repartitions  <br>
display stats repartitions <br>
display moves repartitions <br>