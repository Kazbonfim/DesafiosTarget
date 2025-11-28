# 3.Faça um programa que a partir de um valor e de uma data de vencimento, calcule o valor dos juros na data de hoje considerando que a multa seja de 2,5% ao dia.

from datetime import date # Classe para manipular datas

def calcular_juros(valor, vencimento):
    TAXA_DIARIA = 0.025  # 2,5% ao dia

    try:
        data_venc = date.fromisoformat(vencimento)
    except ValueError:
        print("Data inválida! Use o formato AAAA-MM-DD.")
        return {"juros": 0, "dias_atraso": 0, "valor_total": valor}

    # Data de hoje
    hoje = date.today()
    # Calculando diferenças
    dias = (hoje - data_venc).days

    if dias > 0:  # está atrasado
        juros = valor * TAXA_DIARIA * dias
    else:
        juros = 0 # Não mostar juros
        dias = 0  # Não mostrar dias negativos

    total = valor + juros 

    return {
        "juros": juros,
        "dias_atraso": dias,
        "valor_total": total
    }

# Exemplo de uso
valor = 1000.00

# ANO, MES, DIA
data = "2025-11-20"


resultado = calcular_juros(valor, data)

print(f"Dias de atraso: {resultado['dias_atraso']}")
print(f"Juros: R$ {resultado['juros']:.2f}")
print(f"Total: R$ {resultado['valor_total']:.2f}")
