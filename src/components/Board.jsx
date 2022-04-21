import React, { Component } from "react";
import * as d3 from "https://cdn.skypack.dev/d3@7";
import api from "../api";

class Board extends Component {
    state = { isGameOver: false, isMyTurn: true };
    constructor(props) {
        super(props);
    }

    render = () => {
        return (
            <>
                <svg
                    id="boardSVG"
                    height={this.yScale(this.props.height)}
                    width={this.xScale(this.props.width)}
                ></svg>
            </>
        );
    };

    // Runs once the svg is rendered initially
    componentDidMount = async () => {
        let res = await api.getNewBoard(this.props.width, this.props.height);
        this.board = res.board;
        let cells = d3
            .select("#boardSVG")
            .selectAll("g")
            .data(this.board.flat())
            .enter()
            .append("g")
            .attr("class", "cell");
        let backgrounds = cells.append("g").attr("class", "background");
        backgrounds
            .append("rect")
            .attr("x", (d) => this.xScale(d.x))
            .attr("y", (d) => this.yScale(d.y))
            .attr("width", this.props.size)
            .attr("height", this.props.size)
            .attr("fill", (d, i) => "blue");

        backgrounds
            .append("circle")
            .attr("cx", (d) => this.xScale(d.x) + this.props.size / 2)
            .attr("cy", (d) => this.yScale(d.y) + this.props.size / 2)
            .attr("r", (d) => this.props.size / 3)
            .attr("fill", (d) => "white")
            .on("click", this.clickHandler);

        cells
            .append("circle")
            .attr("class", "piece")
            .attr("cx", (d) => this.xScale(d.x) + this.props.size / 2)
            .attr("cy", (d) => this.yScale(d.y) + this.props.size / 2)
            .attr("r", (d) => (d.val ? this.props.size / 3 : 0));
        //.attr("fill", (d) => this.getPieceColor(d.val));
    };

    setPiece = (x, y, val, callback) => {
        this.board[y][x].val = val;

        return d3
            .select(`#boardSVG > g:nth-child(${y * this.props.width + x + 1}) > circle`)
            .attr("team", (d) => d.val)
            .transition()
            .duration(1000)
            .attr("r", (d) => this.props.size / 3);
    };

    clickHandler = async (e, data) => {
        if (this.state.isGameOver || !this.state.isMyTurn) {
            return;
        }
        this.setState({ isMyTurn: false });

        let res = await api.drop(this.board, data.x);
        if (res.success) {
            this.setPiece(res.location.x, res.location.y, 1);

            // check for game over
            res = await api.isGameOver(this.board);
            if (res.success) {
                console.log(`Player ${res.winner} wins!`);
                this.setState({ isGameOver: true });
                this.props.setWinner(res.winner);
            } else {
                this.props.setTurn(2);
                // sleep for 1 second
                await new Promise((r) => setTimeout(r, 2000));
                this.cpuMove();
            }
        } else {
            console.log(res.msg);
        }

        this.setState({ isMyTurn: true });
    };

    cpuMove = async () => {
        let res = await api.getCPUMove(this.board, "medium");
        if (res.success) {
            this.setPiece(res.location.x, res.location.y, 2);

            // check for game over
            res = await api.isGameOver(this.board);
            if (res.success) {
                console.log(`Player ${res.winner} wins!`);
                this.setState({ isGameOver: true });
                this.props.setWinner(res.winner);
            }

            this.props.setTurn(1);
        } else {
            console.log(res.msg);
        }
    };

    getPieceColor = (val) => {
        switch (val) {
            case 0:
                return "white";
            case 1:
                return "red";
            case 2:
                return "yellow";
            default:
                return "black";
        }
    };

    xScale = d3
        .scaleLinear()
        .domain([0, this.props.width])
        .range([0, this.props.width * this.props.size]);

    yScale = d3
        .scaleLinear()
        .domain([0, this.props.height])
        .range([0, this.props.height * this.props.size]);
}

export default Board;
