import {createArray} from './utils'

// Function to copy temporary solution to
// the final solution
function copyToFinal(from, to, length) {
    to.splice(0, length + 1, ...from)
    to[length] = from[0]
}

// function to find the second minimum edge cost
// having an end at the vertex i
function secondMin(adj, i, length) {
    let first = Infinity
    let second = Infinity;
    for (let j = 0; j < length; j++)
    {
        if (i === j) {
            continue
        }
        if (adj[i][j] <= first) {
            second = first
            first = adj[i][j]
        }
        else if (adj[i][j] <= second && adj[i][j] !== first) {
            second = adj[i][j]
        }
    }
    return second;
}

// Function to find the minimum edge cost
// having an end at the vertex i
function firstMin(adj, i, length) {
    let min = Infinity
    for (let k = 0; k < length; k++) {
        if (adj[i][k] < min && i !== k) {
            min = adj[i][k]
        }
    }
    return min
}

export const TravelingSalesmanProblem = matrix => {
    const VERTEXES_COUNT = matrix.length
    // final_path[] stores the final solution ie, the
    // path of the salesman.
    let final_path

    // visited[] keeps track of the already visited nodes
    // in a particular path
    let visited

    // Stores the final minimum weight of shortest tour.
    let final_res

    // function that takes as arguments:
    // curr_bound -> lower bound of the root node
    // curr_weight-> stores the weight of the path so far
    // level-> current level while moving in the search
    //		 space tree
    // curr_path[] -> where the solution is being stored which
    //			 would later be copied to final_path[]
    function TSPRec(adj, curr_bound, curr_weight, level, curr_path) {
        // base case is when we have reached level N which
        // means we have covered all the nodes once
        if (level === VERTEXES_COUNT) {
            // check if there is an edge from last vertex in
            // path back to the first vertex
            if (adj[curr_path[level - 1]][curr_path[0]] !== 0)
            {
                // curr_res has the total weight of the
                // solution we got
                let curr_res = curr_weight + adj[curr_path[level - 1]][curr_path[0]];

                // Update final result and final path if
                // current result is better.
                if (curr_res < final_res) {
                    copyToFinal(curr_path, final_path, VERTEXES_COUNT)
                    final_res = curr_res;
                }
            }
            return;
        }

        // for any other level iterate for all vertices to
        // build the search space tree recursively
        for (let i = 0; i < VERTEXES_COUNT; i++) {
            // Consider next vertex if it is not same (diagonal
            // entry in adjacency matrix and not visited
            // already)
            if (adj[curr_path[level - 1]][i] !== 0 && visited[i] === false) {
                let temp = curr_bound;
                curr_weight += adj[curr_path[level - 1]][i];

                // different computation of curr_bound for
                // level 2 from the other levels
                const fn = level === 1 ? firstMin : secondMin
                curr_bound -= (fn(adj, curr_path[level - 1], VERTEXES_COUNT) + firstMin(adj, i, VERTEXES_COUNT)) / 2

                // curr_bound + curr_weight is the actual lower bound
                // for the node that we have arrived on
                // If current lower bound < final_res, we need to explore
                // the node further
                if (curr_bound + curr_weight < final_res) {
                    curr_path[level] = i
                    visited[i] = true

                    // call TSPRec for the next level
                    TSPRec(adj, curr_bound, curr_weight, level + 1, curr_path)
                }

                // Else we have to prune the node by resetting
                // all changes to curr_weight and curr_bound
                curr_weight -= adj[curr_path[level - 1]][i]
                curr_bound = temp

                // Also reset the visited array
                // memset(visited, false, sizeof(visited));
                visited = createArray(visited.length,false)
                for (let j = 0; j <= level - 1; j++) {
                    visited[curr_path[j]] = true
                }
            }
        }
    }

    // This function sets up final_path[]
    function TSP(adj) {
        const curr_path = createArray(VERTEXES_COUNT + 1,-1)

        // Calculate initial lower bound for the root node
        // using the formula 1/2 * (sum of first min +
        // second min) for all edges.
        // Also initialize the curr_path and visited array
        let curr_bound = 0
        visited = createArray(visited.length, false)

        // Compute initial bound
        for (let i = 0; i < VERTEXES_COUNT; i++) {
            curr_bound += firstMin(adj, i, VERTEXES_COUNT) + secondMin(adj, i, VERTEXES_COUNT)
        }
        // Rounding off the lower bound to an integer
        curr_bound = curr_bound & 1
            ? curr_bound / 2 + 1
            : curr_bound / 2

        // We start at vertex 1 so the first vertex
        // in curr_path[] is 0
        visited[0] = true
        curr_path[0] = 0

        TSPRec(adj, curr_bound, 0, 1, curr_path);
    }

    final_path = createArray(VERTEXES_COUNT + 1,0)
    visited = createArray(VERTEXES_COUNT, false)
    final_res = Infinity
    TSP(matrix)
    return {
        final_path: final_path.map(x => x + 1),
        final_res,
    }
}
