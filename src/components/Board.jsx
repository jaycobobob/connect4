import React, { Component } from "react";
import * as d3 from "https://cdn.skypack.dev/d3@7";
import api from "../api";

class Board extends Component {
    constructor(props) {
        super(props);
        this.board = this.props.board;
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

    // Runs once the component is rendered initially
    componentDidMount = () => {
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
            .attr("r", (d) => (d.val ? this.props.size / 3 : 0))
            .attr("fill", (d) => this.getPieceColor(d.val));
    };

    setPiece = (x, y, val, callback) => {
        this.board[y][x].val = val;

        return d3
            .select(`#boardSVG > g:nth-child(${y * this.props.width + x + 1}) > circle`)
            .attr("fill", (d) => this.getPieceColor(d.val))
            .transition()
            .duration(1000)
            .attr("r", (d) => this.props.size / 3);
    };

    clickHandler = (e, data) => {
        let res = api.updateBoard(this.board, data.x, 1);
        if (res.success) {
            this.setPiece(res.move.x, res.move.y, 1);

            // check for game over
            res = api.isGameOver(this.board);
            if (res.success) {
                console.log("Game Over");
            } else {
                this.cpuMove();
            }
        } else {
            console.log(res.msg);
        }
    };

    cpuMove = () => {
        let res = api.getCPUMove(this.board, 2);
        if (res.success) {
            this.setPiece(res.move.x, res.move.y, 2);

            // check for game over
            res = api.isGameOver(this.board);
            if (res.success) {
                console.log("Game Over");
            }
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
