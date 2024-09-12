

import Typography from "@mui/material/Typography"

import Link from "@/components/link"

const citiesList1 = [
    {
        label: "Triunfo",
        query: "triunfo"
    },
    {
        label: "Marracuene",
        query: "marracuene"
    },
    {
        label: "Ponta de ouro",
        query: "ponta-de-ouro"
    },
    {
        label: "Tsumene",
        query: "tsumene"
    },
    {
        label: "Malhampsene",
        query: "malhampsene"
    },
]

const citiesList2 = [
    {
        label: "Boane",
        query: "boane"
    },
    {
        label: "T3",
        query: "t3"
    },
    {
        label: "Zona verde",
        query: "zona-verde"
    },
    {
        label: "Jonasse",
        query: "jonasse"
    },
    {
        label: "Mozal",
        query: "mozal"
    },
]


const ListItem = ({ label, query }: { label: string, query: string }) => (
    <li>
        <Link
            className="text-black hover:text-gray-600"
            href={`/search/stores?city=${query}`}>
            { label }
        </Link>
    </li>
)

const MostSearchedCities = () => {

    return (
        <section className="flex flex-col overflow-none px-[5%] py-16">
            <Typography
                component="h2"
                className="font-normal text-2xl">
                People are also searching for properties in
            </Typography>
            <div className="flex gap-x-8 mt-6 sm:gap-x-4">
                <ul className="flex flex-col gap-y-2 w-1/2 sm:flex-row sm:gap-y-0 sm:gap-x-4 sm:flex-wrap sm:w-auto">
                    {
                        citiesList1.map(
                            ({ label, query }) => (
                                <ListItem 
                                    key={query}
                                    label={label}
                                    query={query}
                                />
                            )
                        )
                    }
                </ul>
                <ul className="flex flex-col gap-y-2 w-1/2 sm:flex-row sm:gap-y-0 sm:gap-x-4 sm:flex-wrap sm:w-auto">
                    {
                        citiesList2.map(
                            ({ label, query }) => (
                                <ListItem 
                                    key={query}
                                    label={label}
                                    query={query}
                                />
                            )
                        )
                    }
                </ul>
            </div>
        </section>
    )
}

export default MostSearchedCities